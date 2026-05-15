import { defineConfig, type Config } from "sanity";

import { sanityApiVersion, sanityDataset, sanityProjectId } from "./env";
import { schemas } from "./schemas";
import { studioPlugins } from "./studioPlugins";

/** Shared by CLI (`sanity.config.ts`) and embedded `/studio` in Next.js. */
export function createStudioConfig(): Config | null {
  if (!sanityProjectId) {
    return null;
  }

  return defineConfig({
    name: "default",
    title: "Krishan Construction CMS",
    basePath: "/studio",
    projectId: sanityProjectId,
    dataset: sanityDataset,
    apiVersion: sanityApiVersion,
    releases: {
      enabled: false,
    },
    document: {
      newDocumentOptions: (prev) =>
        prev.filter((item) => item.templateId !== "siteSettings"),
    },
    plugins: studioPlugins,
    schema: {
      types: schemas,
    },
  });
}
