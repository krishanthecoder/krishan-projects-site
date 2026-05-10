/**
 * Creates default gallery categories if missing (idempotent).
 * Requires SANITY_API_WRITE_TOKEN and NEXT_PUBLIC_SANITY_PROJECT_ID (via env or .env/.env.local).
 *
 * Run: npm run seed:gallery-categories
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "next-sanity";

function loadEnvFiles() {
  for (const name of [".env", ".env.local"]) {
    const p = resolve(process.cwd(), name);
    if (!existsSync(p)) continue;
    const text = readFileSync(p, "utf8");
    for (const rawLine of text.split("\n")) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq === -1) continue;
      const key = line.slice(0, eq).trim();
      let val = line.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = val;
    }
  }
}

loadEnvFiles();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-04-21";
const token = process.env.SANITY_API_WRITE_TOKEN;

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
  if (!projectId) {
    console.error(
      "Missing NEXT_PUBLIC_SANITY_PROJECT_ID (set in .env.local or the shell).",
    );
    process.exit(1);
  }
  if (!token) {
    console.error(
      "Missing SANITY_API_WRITE_TOKEN. Create a token with Editor (or write) rights at sanity.io/manage.",
    );
    process.exit(1);
  }

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
