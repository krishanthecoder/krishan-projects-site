import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { sanityApiVersion, sanityDataset, sanityProjectId } from "./sanity/env";
import { schemas } from "./sanity/schemas";

if (!sanityProjectId) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Add it to .env.local so Studio can connect.",
  );
}

export default defineConfig({
  name: "default",
  title: "Krishan Construction CMS",
  basePath: "/studio",
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  /** Classic per-document Publish (Content Releases hides/changes that flow by default). */
  releases: {
    enabled: false,
  },
  plugins: [structureTool()],
  schema: {
    types: schemas,
  },
});
