import type { StructureResolver } from "sanity/structure";

import { HomepageSettingsStructurePane } from "./components/homepage-settings-structure-pane";
import {
  HOMEPAGE_SETTINGS_LIST_ITEM_ID,
  HOMEPAGE_SETTINGS_MIDDLE_PANE_ID,
} from "./structurePaneIds";

export { HOMEPAGE_SETTINGS_LIST_ITEM_ID, HOMEPAGE_SETTINGS_MIDDLE_PANE_ID } from "./structurePaneIds";

const HIDDEN_DESK_TYPES = new Set(["siteSettings", "media.tag"]);

/** Shared by `sanity.config.ts` (CLI) and `app/studio/[[...tool]]/page.tsx` (embedded Studio). */
export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Homepage Settings")
        .id(HOMEPAGE_SETTINGS_LIST_ITEM_ID)
        .child(
          S.component()
            .id(HOMEPAGE_SETTINGS_MIDDLE_PANE_ID)
            .title("Homepage Settings")
            .component(HomepageSettingsStructurePane),
        ),
      ...S.documentTypeListItems().filter((item) => !HIDDEN_DESK_TYPES.has(item.getId() ?? "")),
    ]);
