export const HOMEPAGE_SETTINGS_LIST_ITEM_ID = "homepageSettingsSingleton";
export const HOMEPAGE_SETTINGS_MIDDLE_PANE_ID = "homepageSettingsMiddlePane";

export const TESTIMONIALS_LIST_ITEM_ID = "testimonialsHub";
export const TESTIMONIALS_SUBLIST_ID = "testimonialsSublist";

export const TESTIMONIAL_SUBMISSIONS_LIST_ITEM_ID = "testimonialSubmissionsQueue";
export const TESTIMONIAL_SUBMISSIONS_MIDDLE_PANE_ID = "testimonialSubmissionsMiddlePane";

export const TESTIMONIALS_PUBLISHED_LIST_ID = "testimonialsPublishedList";
export const TESTIMONIALS_DISCARDED_LIST_ID = "testimonialsDiscardedList";

export const DEFAULT_STRUCTURE_PATH = `/studio/structure/${HOMEPAGE_SETTINGS_LIST_ITEM_ID};${HOMEPAGE_SETTINGS_MIDDLE_PANE_ID}`;

export const DEFAULT_STRUCTURE_PANES = [
  [{ id: HOMEPAGE_SETTINGS_LIST_ITEM_ID }],
  [{ id: HOMEPAGE_SETTINGS_MIDDLE_PANE_ID }],
] as const;

export const STUDIO_ENTRY_PATH_STORAGE_KEY = "sanity-studio-entry-path";
