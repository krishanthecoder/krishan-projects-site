import { media } from "sanity-plugin-media";
import { structureTool } from "sanity/structure";

import { deskStructure } from "./deskStructure";
import { defaultHomepageStructureNavigationPlugin } from "./plugins/defaultHomepageStructureNavigationPlugin";

/** Shared Studio plugins (CLI config + embedded `/studio` route). */
export const studioPlugins = [
  structureTool({
    structure: deskStructure,
  }),
  defaultHomepageStructureNavigationPlugin(),
  media(),
];
