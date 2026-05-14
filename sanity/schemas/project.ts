import { defineArrayMember, defineField, defineType } from "sanity";

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
  title: "Project",
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
      name: "galleryCategories",
      title: "Gallery filter tags (project)",
      type: "array",
      description:
        "Categories this project appears under on the Recent Projects gallery filter. Applies to the whole job and every photo in the gallery below.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "galleryCategory" }],
          weak: true,
        }),
      ],
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
      description: "Numeric amount only (e.g. 25000). The site adds the £ symbol.",
      validation: (rule) => rule.min(0),
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
      title: "Services",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Plumbing", value: "Plumbing" },
          { title: "Renovation", value: "Renovation" },
          { title: "Electrical", value: "Electrical" },
          { title: "Civil Works", value: "Civil Works" },
          { title: "Finishing", value: "Finishing" },
        ],
      },
    }),
  ],
});
