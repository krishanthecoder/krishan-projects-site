/**
 * Creates one example Project with several images (uploaded from Unsplash URLs).
 * Idempotent: skips if the example project document already exists.
 *
 * Prerequisites:
 *   - SANITY_API_WRITE_TOKEN and NEXT_PUBLIC_SANITY_PROJECT_ID (.env / .env.local)
 *   - At least one gallery category with a slug (run `npm run seed:gallery-categories` first), or the script creates a fallback category.
 *
 * Run: npm run seed:example-project
 */

import { randomBytes } from "node:crypto";
import { createClient } from "next-sanity";

import { loadEnvFiles, resolveSanityWriteTokenOrExit } from "./load-env.mjs";

const EXAMPLE_PROJECT_ID = "project-site-example-showcase";

/** Royalty-free Unsplash images (same host as next.config `images.remotePatterns`). */
const EXAMPLE_IMAGE_URLS = [
  {
    filename: "example-renovation-living-space.jpg",
    alt: "Open-plan living area after renovation with natural light and timber flooring.",
    url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
  },
  {
    filename: "example-renovation-kitchen.jpg",
    alt: "Modern kitchen installation with white cabinetry and stone worktops.",
    url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=80",
  },
  {
    filename: "example-renovation-bathroom.jpg",
    alt: "Contemporary bathroom refurbishment with walk-in shower and wall tiles.",
    url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1600&q=80",
  },
  {
    filename: "example-renovation-exterior.jpg",
    alt: "Refurbished residential facade with new windows and painted brickwork.",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
  },
];

function blockParagraph(text, key) {
  return {
    _type: "block",
    _key: key,
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: `${key}-span`,
        text,
        marks: [],
      },
    ],
  };
}

function imageKey() {
  return randomBytes(6).toString("hex");
}

async function uploadImageFromUrl(client, { url, filename }) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download image (${res.status}): ${url}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  return client.assets.upload("image", buf, { filename });
}

async function ensureGalleryCategoryIds(client) {
  const ids = await client.fetch(
    `*[_type == "galleryCategory" && defined(slug.current)] | order(sortOrder asc) [0...2]._id`,
  );
  if (Array.isArray(ids) && ids.length > 0) {
    return ids;
  }

  const fallbackId = "galleryCategory-seed-example-general";
  const existing = await client.fetch(`*[_id == $id][0]._id`, { id: fallbackId });
  if (!existing) {
    await client.create({
      _id: fallbackId,
      _type: "galleryCategory",
      title: "General",
      slug: { _type: "slug", current: "general" },
      sortOrder: 999,
    });
    console.log(`Created fallback gallery category: ${fallbackId}`);
  }
  return [fallbackId];
}

async function main() {
  loadEnvFiles();

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) {
    console.error(
      "Missing NEXT_PUBLIC_SANITY_PROJECT_ID (set in .env.local or the shell).",
    );
    process.exit(1);
  }

  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const apiVersion =
    process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-04-21";
  const token = resolveSanityWriteTokenOrExit();

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });

  const existingProject = await client.fetch(`*[_id == $id][0]._id`, {
    id: EXAMPLE_PROJECT_ID,
  });
  if (existingProject) {
    console.log(
      `Skip: example project already exists (${EXAMPLE_PROJECT_ID}). Delete it in Studio to re-seed.`,
    );
    return;
  }

  const categoryIds = await ensureGalleryCategoryIds(client);
  const galleryCategories = categoryIds.map((ref) => ({
    _type: "reference",
    _key: `cat-${ref}`,
    _ref: ref,
    _weak: true,
  }));

  console.log("Uploading example images…");
  const uploaded = [];
  for (const row of EXAMPLE_IMAGE_URLS) {
    const asset = await uploadImageFromUrl(client, row);
    uploaded.push({ assetId: asset._id, alt: row.alt });
    console.log(`  Uploaded asset ${asset._id} (${row.filename})`);
  }

  const makeImage = (assetId, alt) => ({
    _type: "image",
    _key: imageKey(),
    asset: { _type: "reference", _ref: assetId },
    alt,
  });

  const images = uploaded.map((u) => makeImage(u.assetId, u.alt));
  const hero = uploaded[0];
  const featuredImage = {
    _type: "image",
    asset: { _type: "reference", _ref: hero.assetId },
    alt: hero.alt,
  };

  const doc = {
    _id: EXAMPLE_PROJECT_ID,
    _type: "project",
    title: "Example showcase renovation",
    slug: { _type: "slug", current: "example-showcase-renovation" },
    projectLocation: "Example project — demonstration content",
    projectValue: 42000,
    startDate: "2025-01-15",
    endDate: "2025-03-20",
    services: ["Renovation", "Finishing", "Electrical"],
    galleryCategories,
    featuredImage,
    images,
    description: [
      blockParagraph(
        "This is demonstration content so you can preview the project page, gallery filters, and image layout. Replace the copy and images in Sanity Studio when you are ready to go live.",
        "example-desc-1",
      ),
      blockParagraph(
        "The photos are royalty-free placeholders from Unsplash, uploaded by the seed script into your asset library.",
        "example-desc-2",
      ),
    ],
  };

  await client.create(doc);
  console.log(
    `\nCreated example project (${EXAMPLE_PROJECT_ID}) — slug /projects/example-showcase-renovation`,
  );
  console.log("Open Studio → Project → “Example showcase renovation” to edit or publish.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
