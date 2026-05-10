import { defineField, defineType } from "sanity";

export const galleryCategorySchema = defineType({
  name: "galleryCategory",
  title: "Gallery category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description:
        "Shown in the gallery dropdown (e.g. Tile Installation, Painting).",
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sortOrder",
      title: "Sort order",
      type: "number",
      description: "Lower numbers appear first in the gallery filter dropdown.",
      initialValue: 0,
      validation: (rule) => rule.integer(),
    }),
  ],
  preview: {
    select: { title: "title", sortOrder: "sortOrder" },
    prepare({ title, sortOrder }) {
      return {
        title: title ?? "Untitled",
        subtitle: typeof sortOrder === "number" ? `Order: ${sortOrder}` : undefined,
      };
    },
  },
});
