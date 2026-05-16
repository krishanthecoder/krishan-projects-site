/**
 * Converts project.galleryCategories from galleryCategory document references
 * to inline galleryCategoryTag objects ({ title, slug }).
 *
 * Run once after deploying the embedded schema:
 *   npm run migrate:gallery-categories-to-inline
 *
 * Requires SANITY_API_WRITE_TOKEN and NEXT_PUBLIC_SANITY_PROJECT_ID.
 */

import { createClient } from "next-sanity";

import { loadEnvFiles, resolveSanityWriteTokenOrExit } from "./load-env.mjs";

function slugKey() {
  return `tag-${Math.random().toString(36).slice(2, 10)}`;
}

function isReference(item) {
  return item && item._type === "reference" && typeof item._ref === "string";
}

function isInlineTag(item) {
  return item && item._type === "galleryCategoryTag";
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

  const categoryDocs = await client.fetch(
    `*[_type == "galleryCategory"]{
      _id,
      title,
      "slug": slug.current
    }`,
  );

  const categoryById = new Map(
    categoryDocs.map((doc) => [doc._id, doc]),
  );

  const projects = await client.fetch(
    `*[_type == "project"]{
      _id,
      title,
      galleryCategories
    }`,
  );

  let migrated = 0;
  let skipped = 0;

  for (const project of projects) {
    const items = project.galleryCategories ?? [];
    if (items.length === 0) {
      skipped += 1;
      continue;
    }

    const alreadyInline = items.every(isInlineTag);
    const hasRefs = items.some(isReference);

    if (alreadyInline && !hasRefs) {
      skipped += 1;
      continue;
    }

    const inline = [];

    for (const item of items) {
      if (isInlineTag(item)) {
        inline.push(item);
        continue;
      }

      if (!isReference(item)) {
        console.warn(`  Skip unknown galleryCategories entry on ${project._id}`);
        continue;
      }

      const refId = item._ref.replace(/^drafts\./, "");
      const cat = categoryById.get(item._ref) ?? categoryById.get(refId);
      if (!cat?.title || !cat.slug) {
        console.warn(
          `  Missing galleryCategory for ref ${item._ref} on project "${project.title ?? project._id}"`,
        );
        continue;
      }

      inline.push({
        _type: "galleryCategoryTag",
        _key: item._key ?? slugKey(),
        title: cat.title,
        slug: { _type: "slug", current: cat.slug },
      });
    }

    if (inline.length === 0) {
      skipped += 1;
      continue;
    }

    await client.patch(project._id).set({ galleryCategories: inline }).commit();
    migrated += 1;
    console.log(`Migrated: ${project.title ?? project._id} (${inline.length} tag(s))`);
  }

  console.log(`Done. Migrated ${migrated} project(s), skipped ${skipped}.`);
  if (categoryDocs.length > 0) {
    console.log(
      `Note: ${categoryDocs.length} legacy galleryCategory document(s) remain in the dataset.`,
    );
    console.log(
      "You can archive or delete them in Vision/Studio once all projects look correct.",
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
