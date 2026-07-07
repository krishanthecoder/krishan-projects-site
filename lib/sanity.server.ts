import "server-only";

import { createClient } from "next-sanity";

import {
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
} from "@/sanity/env";

export function getSanityWriteClient() {
  const token =
    process.env.SANITY_API_WRITE_TOKEN ??
    process.env.SANITY_TOKEN ??
    process.env.SANITY_WRITE_TOKEN;

  if (!sanityProjectId || !token) {
    return null;
  }

  return createClient({
    projectId: sanityProjectId,
    dataset: sanityDataset,
    apiVersion: sanityApiVersion,
    token,
    useCdn: false,
  });
}
