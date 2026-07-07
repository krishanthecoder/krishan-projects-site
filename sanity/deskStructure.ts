import type { StructureResolver } from "sanity/structure";

import { HomepageSettingsStructurePane } from "./components/homepage-settings-structure-pane";
import { TestimonialSubmissionsPane } from "./components/testimonial-submissions-pane";
import { TestimonialsStructureNavPane } from "./components/testimonials-structure-nav-pane";
import {
  HOMEPAGE_SETTINGS_LIST_ITEM_ID,
  HOMEPAGE_SETTINGS_MIDDLE_PANE_ID,
  TESTIMONIAL_SUBMISSIONS_LIST_ITEM_ID,
  TESTIMONIAL_SUBMISSIONS_MIDDLE_PANE_ID,
  TESTIMONIALS_DISCARDED_LIST_ID,
  TESTIMONIALS_LIST_ITEM_ID,
  TESTIMONIALS_PUBLISHED_LIST_ID,
  TESTIMONIALS_SUBLIST_ID,
} from "./structurePaneIds";

export {
  HOMEPAGE_SETTINGS_LIST_ITEM_ID,
  HOMEPAGE_SETTINGS_MIDDLE_PANE_ID,
  TESTIMONIAL_SUBMISSIONS_LIST_ITEM_ID,
  TESTIMONIAL_SUBMISSIONS_MIDDLE_PANE_ID,
} from "./structurePaneIds";

const HIDDEN_DESK_TYPES = new Set(["siteSettings", "media.tag", "testimonial"]);

const publishedTestimonialFilter =
  '_type == "testimonial" && (!defined(status) || status == "published")';
const discardedTestimonialFilter = '_type == "testimonial" && status == "discarded"';

function resolveTestimonialsChild(S: Parameters<StructureResolver>[0], itemId: string) {
  switch (itemId) {
    case TESTIMONIAL_SUBMISSIONS_LIST_ITEM_ID:
      return S.component()
        .id(TESTIMONIAL_SUBMISSIONS_MIDDLE_PANE_ID)
        .title("Pending submissions")
        .component(TestimonialSubmissionsPane);
    case TESTIMONIALS_PUBLISHED_LIST_ID:
      return S.documentList()
        .id(`${TESTIMONIALS_PUBLISHED_LIST_ID}Documents`)
        .title("Published on site")
        .schemaType("testimonial")
        .filter(publishedTestimonialFilter)
        .defaultOrdering([{ field: "_createdAt", direction: "desc" }]);
    case TESTIMONIALS_DISCARDED_LIST_ID:
      return S.documentList()
        .id(`${TESTIMONIALS_DISCARDED_LIST_ID}Documents`)
        .title("Discarded")
        .schemaType("testimonial")
        .filter(discardedTestimonialFilter)
        .defaultOrdering([{ field: "_createdAt", direction: "desc" }]);
    default:
      return undefined;
  }
}

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
      S.listItem()
        .title("Customer Reviews")
        .id(TESTIMONIALS_LIST_ITEM_ID)
        .child(
          S.component()
            .id(TESTIMONIALS_SUBLIST_ID)
            .title("Customer Reviews")
            .component(TestimonialsStructureNavPane)
            .child((itemId) => resolveTestimonialsChild(S, itemId)),
        ),
      ...S.documentTypeListItems().filter((item) => !HIDDEN_DESK_TYPES.has(item.getId() ?? "")),
    ]);
