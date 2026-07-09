import { defineConfig, type Config } from "sanity";

import { StudioLayoutWithPublishStyles } from "./components/StudioLayoutWithPublishStyles";
import { resolveDocumentActions } from "./documentActions/discardedTestimonialActions";
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
      actions: (prev, context) => resolveDocumentActions(prev, context),
      newDocumentOptions: (prev) =>
        prev.filter((item) => item.templateId !== "siteSettings"),
    },
    studio: {
      components: {
        layout: StudioLayoutWithPublishStyles,
      },
    },
    plugins: studioPlugins,
    schema: {
      types: schemas,
    },
  });
}
