/**
 * Adds _weak: true to existing project image → galleryCategory references so
 * categories can be deleted in Studio without "blocked by references" errors.
 *
 * Requires SANITY_API_WRITE_TOKEN and NEXT_PUBLIC_SANITY_PROJECT_ID.
 *
 * Run once after deploying weak refs in the schema:
 *   npm run migrate:gallery-category-refs-weak
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

function weakifyImages(images) {
  if (!Array.isArray(images)) return { images, changed: false };
  let changed = false;
  const next = images.map((img) => {
    const refs = img?.galleryCategories;
    if (!Array.isArray(refs) || refs.length === 0) return img;
    let imgChanged = false;
    const nextRefs = refs.map((r) => {
      if (r && r._type === "reference" && r._ref && r._weak !== true) {
        imgChanged = true;
        return { ...r, _weak: true };
      }
      return r;
    });
    if (!imgChanged) return img;
    changed = true;
    return { ...img, galleryCategories: nextRefs };
  });
  return { images: next, changed };
}

async function main() {
  if (!projectId) {
    console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID.");
    process.exit(1);
  }
  if (!token) {
    console.error("Missing SANITY_API_WRITE_TOKEN.");
    process.exit(1);
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });

  const projects = await client.fetch(`*[_type == "project"]{_id, images}`);
  let patched = 0;

  for (const doc of projects) {
    const { images, changed } = weakifyImages(doc.images);
    if (!changed) continue;
    await client.patch(doc._id).set({ images }).commit();
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
