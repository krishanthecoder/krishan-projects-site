import { defineField, defineType } from "sanity";

import { GalleryCategoryTagInput } from "../components/gallery-category-tag-input";
import { galleryTagSlugSource } from "../lib/gallery-tag-slug";

/** Inline filter tag on a project (title + slug generated from title). */
export const galleryCategoryTagSchema = defineType({
  name: "galleryCategoryTag",
  title: "Filter project tag",
  type: "object",
  components: {
    input: GalleryCategoryTagInput,
  },
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Shown in the gallery filter (e.g. Tiling, Painting).",
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: galleryTagSlugSource,
        maxLength: 96,
        disableArrayWarning: true,
      },
      validation: (rule) =>
        rule.custom((value) => {
          const current =
            value && typeof value === "object" && "current" in value
              ? (value as { current?: string }).current
              : typeof value === "string"
                ? value
                : undefined;
          if (current && current.trim().length > 0) return true;
          return "Add a slug (use Generate from the title).";
        }),
    }),
  ],
  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare({ title, slug }) {
      return {
        title: title ?? "Untitled",
        subtitle: slug ? `/${slug}` : "No slug",
      };
    },
  },
});
