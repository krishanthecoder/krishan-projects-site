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
      validation: (rule) =>
        rule.custom((value) => {
          const current =
            value && typeof value === "object" && "current" in value
              ? (value as { current?: string }).current
              : typeof value === "string"
                ? value
                : undefined;
          if (current && current.trim().length > 0) return true;
          return "Add a slug (use Generate from the title). Publishing needs a slug.";
        }),
    }),
    defineField({
      name: "sortOrder",
      title: "Sort order",
      type: "number",
      description: "Lower numbers appear first in the gallery filter dropdown.",
      initialValue: 0,
      validation: (rule) =>
        rule.custom((value) => {
          if (value === undefined || value === null) return true;
          if (typeof value === "number" && Number.isInteger(value)) return true;
          return "Use a whole number (e.g. 0, 1, 2). Decimals are not allowed.";
        }),
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
