/**
 * Imports Checkatrade reviews from design/checkatrade-import/reviews.json into Sanity.
 * De-duplicates by matching posted date + review content against existing testimonials.
 *
 * Run: npm run import:checkatrade-testimonials
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "next-sanity";

import { loadEnvFiles, resolveSanityWriteTokenOrExit } from "./load-env.mjs";

const REVIEWS_PATH = resolve(
  process.cwd(),
  "design/checkatrade-import/reviews.json",
);

/** Checkatrade scores are out of 10; Sanity testimonials use 1–5 stars. */
function toStarRating(checkatradeScore) {
  const stars = Math.round(checkatradeScore / 2);
  return Math.min(5, Math.max(1, stars));
}

function parseUkPostedDate(posted) {
  const parsed = new Date(`${posted} 12:00:00 GMT`);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Could not parse posted date: ${posted}`);
  }
  return parsed.toISOString();
}

function buildJobTitle(review) {
  const base = review.jobTitle.trim();
  const location = review.location ? ` — ${review.location}` : "";
  return `${base}${location}`;
}

function normalizeContent(value) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function contentPrefix(value, length = 48) {
  return normalizeContent(value).slice(0, length);
}

function findMatchingTestimonial(existingRows, review, postedIso) {
  const postedDay = postedIso.slice(0, 10);
  const reviewPrefix = contentPrefix(review.content);

  return (
    existingRows.find((row) => {
      if (!row.createdAt?.startsWith(postedDay)) return false;
      return contentPrefix(row.content || "") === reviewPrefix;
    }) ?? null
  );
}

async function main() {
  loadEnvFiles();

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) {
    console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID.");
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

  const reviews = JSON.parse(readFileSync(REVIEWS_PATH, "utf8"));
  if (!Array.isArray(reviews) || reviews.length === 0) {
    console.error(`No reviews found in ${REVIEWS_PATH}`);
    process.exit(1);
  }

  const existingRows = await client.fetch(
    `*[_type == "testimonial"]{_id, content, "createdAt": _createdAt}`,
  );

  console.log(
    `Importing ${reviews.length} Checkatrade review(s) (${existingRows.length} already in Sanity)…`,
  );

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const review of reviews) {
    const jobTitle = buildJobTitle(review);
    if (jobTitle.length < 5) {
      throw new Error(`jobTitle too short for ${review.id}`);
    }

    const postedIso = parseUkPostedDate(review.posted);
    const matched = findMatchingTestimonial(existingRows, review, postedIso);
    const docId = matched?._id ?? `testimonial-checkatrade-${review.id}`;

    const doc = {
      _id: docId,
      _type: "testimonial",
      status: "published",
      source: "checkatrade-import",
      clientName: review.clientName,
      rating: toStarRating(review.checkatradeScore),
      jobTitle,
      content: review.content,
      _createdAt: postedIso,
    };

    if (matched) {
      const unchanged =
        matched.content === review.content &&
        matched.createdAt?.slice(0, 10) === postedIso.slice(0, 10);
      if (unchanged && docId.startsWith("testimonial-checkatrade-")) {
        skipped += 1;
        console.log(`  Skipped ${docId} — already up to date (${review.posted})`);
        continue;
      }

      await client.patch(docId).set(doc).commit();
      updated += 1;
      console.log(`  Updated ${docId} — ${review.clientName} (${review.posted})`);
      matched.content = review.content;
      matched.createdAt = postedIso;
      continue;
    }

    await client.create(doc);
    created += 1;
    existingRows.push({
      _id: docId,
      content: review.content,
      createdAt: postedIso,
    });
    console.log(`  Created ${docId} — ${review.clientName} (${review.posted})`);
  }

  console.log(`\nDone. Created ${created}, updated ${updated}, skipped ${skipped}.`);
  console.log("Open Studio → Testimonials to review, then check the homepage carousel.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
