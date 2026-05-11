/**
 * Creates default gallery categories if missing (idempotent).
 * Requires SANITY_API_WRITE_TOKEN and NEXT_PUBLIC_SANITY_PROJECT_ID (via env or .env/.env.local).
 *
 * Run: npm run seed:gallery-categories
 */

import { createClient } from "next-sanity";

import { loadEnvFiles, resolveSanityWriteTokenOrExit } from "./load-env.mjs";

/** Stable IDs so seed does not duplicate; skips create if doc already exists (Studio edits kept). */
const DEFAULT_CATEGORIES = [
  { _id: "galleryCategory-tiling", title: "Tiling", slug: "tiling", sortOrder: 10 },
  {
    _id: "galleryCategory-plastering",
    title: "Plastering",
    slug: "plastering",
    sortOrder: 20,
  },
  { _id: "galleryCategory-painting", title: "Painting", slug: "painting", sortOrder: 30 },
  {
    _id: "galleryCategory-drainage",
    title: "Drainage",
    slug: "drainage",
    sortOrder: 40,
  },
];

async function main() {
  loadEnvFiles();

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) {
    console.error(
      "Missing NEXT_PUBLIC_SANITY_PROJECT_ID (set in .env.local or the shell).",
    );
    process.exit(1);
  }

  const token = resolveSanityWriteTokenOrExit();
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const apiVersion =
    process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-04-21";

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });

  for (const row of DEFAULT_CATEGORIES) {
    const existing = await client.fetch(`*[_id == $id][0]._id`, { id: row._id });
    if (existing) {
      console.log(`Skip (exists): ${row.title} (${row._id})`);
      continue;
    }
    await client.create({
      _id: row._id,
      _type: "galleryCategory",
      title: row.title,
      slug: { _type: "slug", current: row.slug },
      sortOrder: row.sortOrder,
    });
    console.log(`Created: ${row.title} (${row._id})`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
