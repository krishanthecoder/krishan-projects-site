import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { schemas } from "./sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

if (!projectId) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Add it to .env.local so Studio can connect.",
  );
}

export default defineConfig({
  name: "default",
  title: "Krishan Construction CMS",
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: {
    types: schemas,
  },
});
