/**
 * Adds _weak: true to existing project → galleryCategory references (project-level)
 * so categories can be deleted in Studio without "blocked by references".
 *
 * Requires SANITY_API_WRITE_TOKEN and NEXT_PUBLIC_SANITY_PROJECT_ID.
 *
 * Run once after deploying weak refs in the schema:
 *   npm run migrate:gallery-category-refs-weak
 */

import { createClient } from "next-sanity";

import { loadEnvFiles, resolveSanityWriteTokenOrExit } from "./load-env.mjs";

function weakifyRefArray(refs) {
  if (!Array.isArray(refs) || refs.length === 0) return { refs, changed: false };
  let changed = false;
  const next = refs.map((r) => {
    if (r && r._type === "reference" && r._ref && r._weak !== true) {
      changed = true;
      return { ...r, _weak: true };
    }
    return r;
  });
  return { refs: next, changed };
}

async function main() {
  loadEnvFiles();

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) {
    console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID.");
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

  const projects = await client.fetch(
    `*[_type == "project"]{_id, galleryCategories}`,
  );
  let patched = 0;

  for (const doc of projects) {
    const { refs: galleryCategories, changed: rootChanged } = weakifyRefArray(
      doc.galleryCategories,
    );
    if (!rootChanged) continue;

    const update = { galleryCategories };
    await client.patch(doc._id).set(update).commit();
    patched += 1;
    console.log(`Patched project ${doc._id}`);
  }

  console.log(
    patched === 0
      ? "No strong gallery category references found. Nothing to do."
      : `Done. Updated ${patched} project(s).`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
