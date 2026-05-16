import type { SlugSourceContext } from "sanity";

import { formatGalleryTagTitle, galleryTagSlugFromTitle } from "./gallery-tag-utils";

/** Slug source for inline tags — uses the tag title, not the parent project title. */
export function galleryTagSlugSource(
  _document: unknown,
  context: SlugSourceContext,
): string {
  const parent = context.parent;
  if (parent && typeof parent === "object" && "title" in parent) {
    const title = (parent as { title?: unknown }).title;
    if (typeof title === "string") {
      return galleryTagSlugFromTitle(formatGalleryTagTitle(title));
    }
  }
  return "";
}
