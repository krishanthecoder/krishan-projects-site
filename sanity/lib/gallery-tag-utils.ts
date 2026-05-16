export type GalleryCategoryTagValue = {
  _type?: "galleryCategoryTag";
  _key?: string;
  title?: string;
  slug?: { _type?: "slug"; current?: string };
};

/** True when the tag is not ready to keep on the project (empty new tag or cancelled edit). */
export function isIncompleteGalleryTag(value: unknown): boolean {
  const tag = value as GalleryCategoryTagValue | null | undefined;
  const title = tag?.title?.trim() ?? "";
  const slug = tag?.slug?.current?.trim() ?? "";
  return title.length === 0 || slug.length === 0;
}
