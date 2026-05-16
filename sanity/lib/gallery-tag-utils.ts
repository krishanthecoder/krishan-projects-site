export type GalleryCategoryTagValue = {
  _type?: "galleryCategoryTag";
  _key?: string;
  title?: string;
  slug?: { _type?: "slug"; current?: string };
};

const MIN_GALLERY_TAG_TITLE_LENGTH = 2;

/** e.g. "painting" → "Painting" */
export function formatGalleryTagTitle(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    return "";
  }
  return trimmed.charAt(0).toLocaleUpperCase("en") + trimmed.slice(1);
}

/** Lowercase slug derived from the display title (e.g. "Kitchen Tiling" → "kitchen-tiling"). */
export function galleryTagSlugFromTitle(title: string): string {
  const formatted = formatGalleryTagTitle(title);
  if (!formatted) {
    return "";
  }

  return formatted
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export function isValidGalleryTagTitle(title: string): boolean {
  return formatGalleryTagTitle(title).length >= MIN_GALLERY_TAG_TITLE_LENGTH;
}

/** True when the tag is not ready to keep on the project (empty new tag or cancelled edit). */
export function isIncompleteGalleryTag(value: unknown): boolean {
  const tag = value as GalleryCategoryTagValue | null | undefined;
  return !isValidGalleryTagTitle(tag?.title ?? "");
}
