import type { StructureResolver } from "sanity/structure";

import { HomepageSettingsStructurePane } from "./components/homepage-settings-structure-pane";

/** Shared by `sanity.config.ts` (CLI) and `app/studio/[[...tool]]/page.tsx` (embedded Studio). */
export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Homepage settings")
        .id("homepageSettingsSingleton")
        .child(
          S.component()
            .id("homepageSettingsMiddlePane")
            .title("Homepage settings")
            .component(HomepageSettingsStructurePane),
        ),
      ...S.documentTypeListItems().filter((item) => item.getId() !== "siteSettings"),
    ]);
