/** Tags already used on projects (for the “add existing tag” picker). */
export const EXISTING_GALLERY_TAGS_QUERY = /* groq */ `
  *[_type == "project" && defined(galleryCategories)].galleryCategories[]{
    title,
    "slug": slug.current
  }[defined(slug) && defined(title) && length(title) > 0]
`;

export type ExistingGalleryTag = {
  title: string;
  slug: string;
};
