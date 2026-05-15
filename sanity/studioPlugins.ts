import { media } from "sanity-plugin-media";
import { structureTool } from "sanity/structure";

import { deskStructure } from "./deskStructure";

/** Shared Studio plugins (CLI config + embedded `/studio` route). */
export const studioPlugins = [
  structureTool({
    structure: deskStructure,
  }),
  media(),
];
