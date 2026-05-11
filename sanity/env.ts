/** Shared Sanity identifiers for Studio, CLI config, and the Next.js data client. */

export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

export const sanityDataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

/** Keep in sync everywhere so Studio and `next-sanity` hit the same API revision. */
export const sanityApiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-04-21";
