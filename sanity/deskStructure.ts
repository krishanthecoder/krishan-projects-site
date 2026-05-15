import type { StructureResolver } from "sanity/structure";

import { HomepageSettingsStructurePane } from "./components/homepage-settings-structure-pane";

const HIDDEN_DESK_TYPES = new Set(["siteSettings", "media.tag"]);

/** Shared by `sanity.config.ts` (CLI) and `app/studio/[[...tool]]/page.tsx` (embedded Studio). */
export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Homepage Settings")
        .id("homepageSettingsSingleton")
        .child(
          S.component()
            .id("homepageSettingsMiddlePane")
            .title("Homepage Settings")
            .component(HomepageSettingsStructurePane),
        ),
      ...S.documentTypeListItems().filter((item) => !HIDDEN_DESK_TYPES.has(item.getId() ?? "")),
    ]);
