import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-04-21";

export const sanityConfigured = Boolean(projectId);

export const sanityClient = createClient({
  projectId: projectId ?? "missing-project-id",
  dataset,
  apiVersion,
  useCdn: true,
});
