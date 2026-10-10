/**
 * Gives existing projects an order rank so they can be dragged in Studio
 * and the public projects page keeps the current newest-first order
 * until you rearrange them.
 *
 * Safe to re-run: documents that already have orderRank are left as they are.
 * Drafts missing a rank are copied from the published document.
 *
 * Run: npm run seed:project-order
 */

import { createClient } from "next-sanity";
import { LexoRank } from "lexorank";

import { loadEnvFiles, resolveSanityWriteTokenOrExit } from "./load-env.mjs";

function publishedId(id) {
  return id.startsWith("drafts.") ? id.slice("drafts.".length) : id;
}

async function main() {
  loadEnvFiles();

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) {
    console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID (set in .env.local or the shell).");
    process.exit(1);
  }

  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-04-21";
  const token = resolveSanityWriteTokenOrExit();

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });

  const docs = await client.fetch(
    `*[_type == "project" && !(_id in path("versions.**"))] | order(_createdAt desc) {
      _id,
      title,
      _createdAt,
      orderRank
    }`,
  );

  /** @type {Map<string, { id: string, title: string, createdAt: string, docs: typeof docs }>} */
  const groups = new Map();
  for (const doc of docs) {
    const id = publishedId(doc._id);
    const group = groups.get(id) ?? {
      id,
      title: doc.title ?? id,
      createdAt: doc._createdAt,
      docs: [],
    };
    group.docs.push(doc);
    if (doc.title) group.title = doc.title;
    if (!doc._id.startsWith("drafts.")) group.createdAt = doc._createdAt;
    groups.set(id, group);
  }

  const ordered = [...groups.values()].sort((a, b) => {
    const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
    const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
    return bTime - aTime;
  });

  /** @type {{ id: string, value: string }[]} */
  const patches = [];

  const fullyUnranked = ordered.filter((group) => group.docs.every((doc) => !doc.orderRank));
  const noneRanked = fullyUnranked.length === ordered.length;

  if (noneRanked && ordered.length > 0) {
    let rank = LexoRank.min();
    for (const group of ordered) {
      rank = rank.genNext().genNext();
      const value = rank.toString();
      for (const doc of group.docs) {
        patches.push({ id: doc._id, value });
      }
    }
  } else {
    for (const group of ordered) {
      const existing = group.docs.find((doc) => typeof doc.orderRank === "string")?.orderRank;
      if (!existing) continue;
      for (const doc of group.docs) {
        if (!doc.orderRank) patches.push({ id: doc._id, value: existing });
      }
    }

    const rankedValues = ordered
      .flatMap((group) => group.docs.map((doc) => doc.orderRank))
      .filter((value) => typeof value === "string");
    let cursor = rankedValues.length
      ? rankedValues.reduce((min, value) => (value < min ? value : min))
      : null;
    let rank = cursor ? LexoRank.parse(cursor) : LexoRank.min();

    // Oldest first so the newest unranked project ends up at the top.
    for (const group of [...fullyUnranked].reverse()) {
      rank = rank.genPrev().genPrev();
      const value = rank.toString();
      for (const doc of group.docs) {
        patches.push({ id: doc._id, value });
      }
    }
  }

  if (patches.length === 0) {
    console.log("Every project already has an order rank. Nothing to do.");
    return;
  }

  let transaction = client.transaction();
  for (const patch of patches) {
    transaction = transaction.patch(patch.id, { set: { orderRank: patch.value } });
  }
  await transaction.commit();

  const titled = new Map();
  for (const patch of patches) {
    const id = publishedId(patch.id);
    if (!titled.has(id)) {
      const group = groups.get(id);
      titled.set(id, `${group?.title ?? id} → ${patch.value}`);
    }
  }
  console.log(`Set order on ${patches.length} document(s), newest first:`);
  for (const line of titled.values()) console.log(`  ${line}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
