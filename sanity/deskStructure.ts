import type { StructureResolver } from "sanity/structure";

import { DiscardedTestimonialEditPane } from "./components/discarded-testimonial-edit-pane";
import { DiscardedTestimonialsPane } from "./components/discarded-testimonials-pane";
import { HomepageSettingsStructurePane } from "./components/homepage-settings-structure-pane";
import { PendingTestimonialEditPane } from "./components/pending-testimonial-edit-pane";
import { PublishedTestimonialEditPane } from "./components/published-testimonial-edit-pane";
import { PublishedTestimonialsPane } from "./components/published-testimonials-pane";
import { TestimonialSubmissionsPane } from "./components/testimonial-submissions-pane";
import { TestimonialsStructureNavPane } from "./components/testimonials-structure-nav-pane";
import {
  HOMEPAGE_SETTINGS_LIST_ITEM_ID,
  HOMEPAGE_SETTINGS_MIDDLE_PANE_ID,
  TESTIMONIAL_SUBMISSIONS_LIST_ITEM_ID,
  TESTIMONIAL_SUBMISSIONS_MIDDLE_PANE_ID,
  TESTIMONIAL_PENDING_EDIT_LIST_ITEM_ID,
  TESTIMONIAL_PUBLISHED_EDIT_LIST_ITEM_ID,
  TESTIMONIAL_DISCARDED_EDIT_LIST_ITEM_ID,
  TESTIMONIALS_DISCARDED_LIST_ID,
  TESTIMONIALS_DISCARDED_MIDDLE_PANE_ID,
  TESTIMONIALS_LIST_ITEM_ID,
  TESTIMONIALS_PUBLISHED_LIST_ID,
  TESTIMONIALS_PUBLISHED_MIDDLE_PANE_ID,
  TESTIMONIALS_SUBLIST_ID,
} from "./structurePaneIds";

export {
  HOMEPAGE_SETTINGS_LIST_ITEM_ID,
  HOMEPAGE_SETTINGS_MIDDLE_PANE_ID,
  TESTIMONIAL_SUBMISSIONS_LIST_ITEM_ID,
  TESTIMONIAL_SUBMISSIONS_MIDDLE_PANE_ID,
} from "./structurePaneIds";

const HIDDEN_DESK_TYPES = new Set(["siteSettings", "media.tag", "testimonial"]);

function resolveTestimonialsChild(S: Parameters<StructureResolver>[0], itemId: string) {
  switch (itemId) {
    case TESTIMONIAL_SUBMISSIONS_LIST_ITEM_ID:
      return S.component()
        .id(TESTIMONIAL_SUBMISSIONS_MIDDLE_PANE_ID)
        .title("Pending submissions")
        .component(TestimonialSubmissionsPane)
        .child((childId) => {
          if (childId === TESTIMONIAL_PENDING_EDIT_LIST_ITEM_ID) {
            return S.component()
              .id(`${TESTIMONIAL_PENDING_EDIT_LIST_ITEM_ID}Pane`)
              .title("Edit review")
              .component(PendingTestimonialEditPane);
          }
          return undefined;
        });
    case TESTIMONIALS_PUBLISHED_LIST_ID:
      return S.component()
        .id(TESTIMONIALS_PUBLISHED_MIDDLE_PANE_ID)
        .title("Published on site")
        .component(PublishedTestimonialsPane)
        .child((childId) => {
          if (childId === TESTIMONIAL_PUBLISHED_EDIT_LIST_ITEM_ID) {
            return S.component()
              .id(`${TESTIMONIAL_PUBLISHED_EDIT_LIST_ITEM_ID}Pane`)
              .title("Published review")
              .component(PublishedTestimonialEditPane);
          }
          return undefined;
        });
    case TESTIMONIALS_DISCARDED_LIST_ID:
      return S.component()
        .id(TESTIMONIALS_DISCARDED_MIDDLE_PANE_ID)
        .title("Discarded")
        .component(DiscardedTestimonialsPane)
        .child((childId) => {
          if (childId === TESTIMONIAL_DISCARDED_EDIT_LIST_ITEM_ID) {
            return S.component()
              .id(`${TESTIMONIAL_DISCARDED_EDIT_LIST_ITEM_ID}Pane`)
              .title("Discarded review")
              .component(DiscardedTestimonialEditPane);
          }
          return undefined;
        });
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
