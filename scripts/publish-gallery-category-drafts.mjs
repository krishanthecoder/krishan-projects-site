/**
 * Publishes every gallery category that exists only as a draft (or has unpublished draft changes).
 * Uses the same publish action as Sanity Studio.
 *
 * Requires SANITY_API_WRITE_TOKEN and NEXT_PUBLIC_SANITY_PROJECT_ID (.env / .env.local).
 *
 * Run: npm run publish:gallery-category-drafts
 */

import { createClient } from "next-sanity";

import { loadEnvFiles, resolveSanityWriteTokenOrExit } from "./load-env.mjs";

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

  const drafts = await client.fetch(
    `*[_type == "galleryCategory" && _id in path("drafts.**")] {_id, title}`,
  );

  if (!drafts.length) {
    console.log("No draft gallery categories found. Nothing to publish.");
    return;
  }

  for (const doc of drafts) {
    const draftId = doc._id;
    const publishedId = draftId.replace(/^drafts\./, "");
    const label = doc.title ?? publishedId;
    try {
      await client.action({
        actionType: "sanity.action.document.publish",
        draftId,
        publishedId,
      });
      console.log(`Published: ${label} (${draftId} → ${publishedId})`);
    } catch (err) {
      console.error(`Failed: ${label}`, err.message ?? err);
      process.exitCode = 1;
    }
  }

  if (!process.exitCode) console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
