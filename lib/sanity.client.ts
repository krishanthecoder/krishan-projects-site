import { createClient } from "next-sanity";

import {
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
} from "@/sanity/env";

export const sanityConfigured = Boolean(sanityProjectId);

/** Shared tag for `revalidateTag("sanity", "max")` from `/api/revalidate`. */
export const SANITY_CACHE_TAG = "sanity";

/**
 * Sanity CDN (`api.cdn.sanity.io`) can lag briefly behind writes. In development we default to
 * the uncached API so Studio edits show up sooner; in production CDN stays on unless overridden.
 */
function resolveUseCdn(): boolean {
  const v = process.env.SANITY_USE_CDN?.toLowerCase();
  if (v === "false" || v === "0") return false;
  if (v === "true" || v === "1") return true;
  return process.env.NODE_ENV === "production";
}

export const sanityClient = createClient({
  projectId: sanityProjectId ?? "missing-project-id",
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  useCdn: resolveUseCdn(),
});

/** Server-only client for reading drafts in development (requires SANITY_API_READ_TOKEN or SANITY_API_WRITE_TOKEN). */
const previewToken =
  process.env.SANITY_API_READ_TOKEN ?? process.env.SANITY_API_WRITE_TOKEN;

export const sanityPreviewClient =
  sanityConfigured && previewToken
    ? createClient({
        projectId: sanityProjectId!,
        dataset: sanityDataset,
        apiVersion: sanityApiVersion,
        useCdn: false,
        token: previewToken,
      })
    : null;

/**
 * Next.js fetch cache options for all GROQ reads. Tune `SANITY_REVALIDATE_SECONDS` (default 60)
 * to trade freshness vs. origin load. Tag `sanity` enables on-demand purge via `/api/revalidate`.
 */
export function sanityFetchOptions(extraTags: string[] = []) {
  const raw = process.env.SANITY_REVALIDATE_SECONDS;
  let revalidate: number;
  if (raw !== undefined) {
    const parsed = Number.parseInt(raw, 10);
    revalidate = Number.isFinite(parsed) && parsed > 0 ? parsed : 60;
  } else if (process.env.NODE_ENV === "development") {
    revalidate = 15;
  } else {
    revalidate = 60;
  }

  return {
    next: {
      revalidate,
      tags: [SANITY_CACHE_TAG, ...extraTags],
    },
  };
}
