import { defineArrayMember, defineField, defineType } from "sanity";

import { GalleryCategoriesField } from "../components/gallery-categories-field";
import { GalleryCategoriesInput } from "../components/gallery-categories-input";

/** Alt is only validated once an asset exists, so the upload step is not treated as invalid. */
function imageAltWhenAsset(minLen: number) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Sanity Rule chain is not typed here
  return (rule: any) =>
    rule.custom((alt: unknown, context: { parent?: { asset?: unknown } }) => {
      const image = context.parent;
      if (!image?.asset) return true;
      const text = typeof alt === "string" ? alt.trim() : "";
      if (text.length < minLen) {
        return `Add at least ${minLen} characters of alt text (required when an image is set).`;
      }
      return true;
    });
}

export const projectSchema = defineType({
  name: "project",
  title: "Projects",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().min(3),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL for the project page (e.g. /projects/kitchen-renovation-barking).",
      options: { source: "title", maxLength: 96 },
      validation: (rule) =>
        rule.required().custom((value) => {
          const current =
            value && typeof value === "object" && "current" in value
              ? (value as { current?: string }).current
              : typeof value === "string"
                ? value
                : undefined;
          if (current && current.trim().length > 0) return true;
          return "Generate a slug from the title so this project can have its own page.";
        }),
    }),
    defineField({
      name: "galleryCategories",
      title: "Filter project tags",
      type: "array",
      description:
        "Choose how visitors find this job on the Recent Projects gallery — e.g. Tiling, Painting, Blockwork.",
      of: [defineArrayMember({ type: "galleryCategoryTag" })],
      options: {
        disableActions: ["add", "duplicate", "copy"],
      },
      components: {
        field: GalleryCategoriesField,
        input: GalleryCategoriesInput,
      },
    }),
    defineField({
      name: "featuredImage",
      title: "Featured image",
      type: "image",
      options: { hotspot: true },
      description:
        "Shown on the gallery grid, homepage “From a recent job”, and as the project page hero. Falls back to the first gallery image if empty.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Short description for accessibility and SEO.",
          validation: imageAltWhenAsset(10),
        }),
      ],
    }),
    defineField({
      name: "beforeImage",
      title: "Before photo (optional)",
      type: "image",
      options: { hotspot: true },
      description:
        "Optional “before” shot paired with the featured image as the “after” on the project page. Leave empty to show only the featured image.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Describe the before state for accessibility and SEO.",
          validation: imageAltWhenAsset(10),
        }),
      ],
    }),
    defineField({
      name: "beforeAfterAligned",
      title: "Same angle before & after",
      type: "boolean",
      description:
        "When on, the site shows a drag-to-compare slider (best when both photos match the same viewpoint). Turn off if the angles differ — visitors see labelled side-by-side images instead.",
      initialValue: false,
    }),
    defineField({
      name: "startDate",
      title: "Start date",
      type: "date",
      description: "When work started on site (optional).",
      options: {
        dateFormat: "DD-MM-YYYY",
      },
    }),
    defineField({
      name: "endDate",
      title: "End date",
      type: "date",
      description: "When the job finished or is expected to finish (optional).",
      options: {
        dateFormat: "DD-MM-YYYY",
      },
    }),
    defineField({
      name: "projectValue",
      title: "Price (GBP)",
      type: "number",
      description:
        "Numeric amount only (e.g. 25000). The site adds the £ symbol when set (optional).",
      validation: (rule) =>
        rule.custom((value) => {
          if (value === undefined || value === null) {
            return true;
          }
          if (typeof value === "number" && !Number.isNaN(value) && value >= 0) {
            return true;
          }
          return "Enter a valid amount (0 or greater), or leave blank.";
        }),
    }),
    defineField({
      name: "projectLocation",
      title: "Project location",
      type: "string",
      description: "Example: Kitchen renovation — Barking",
      validation: (rule) => rule.required().min(3),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
      description: "Full write-up shown on the project page.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "images",
      title: "Gallery images",
      type: "array",
      description: "All photos for this job. Thumbnails and lightbox on the project page.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
              description:
                "Describe the image for accessibility and SEO (e.g. 'Kitchen renovation in Surrey with custom cabinets').",
              validation: imageAltWhenAsset(10),
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "services",
      title: "Additional Services",
      type: "array",
      description:
        "These show as pills on the project page (after your filter tags). They do not control gallery filtering.",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Refurbishment", value: "Refurbishment" },
          { title: "Renovation", value: "Renovation" },
          { title: "Finishing", value: "Finishing" },
        ],
      },
    }),
  ],
});
