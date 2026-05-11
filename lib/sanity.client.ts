import { createClient } from "next-sanity";

import {
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
} from "@/sanity/env";

export const sanityConfigured = Boolean(sanityProjectId);

export const sanityClient = createClient({
  projectId: sanityProjectId ?? "missing-project-id",
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  useCdn: true,
});
