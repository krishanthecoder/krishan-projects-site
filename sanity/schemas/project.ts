import { defineArrayMember, defineField, defineType } from "sanity";

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
      name: "images",
      title: "Images",
      type: "array",
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
              validation: (rule) => rule.required().min(10),
            }),
            defineField({
              name: "galleryCategories",
              title: "Gallery categories",
              type: "array",
              description:
                "Tags this photo appears under on the site gallery filter (optional).",
              of: [
                defineArrayMember({
                  type: "reference",
                  to: [{ type: "galleryCategory" }],
                }),
              ],
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "projectLocation",
      title: "Project Location",
      type: "string",
      description: "Example: Kitchen Renovation - Chelsea",
      validation: (rule) => rule.required().min(3),
    }),
    defineField({
      name: "projectValue",
      title: "Project Value",
      type: "number",
      description: "Enter numeric amount only (e.g. 25000). GBP symbol is added automatically.",
      validation: (rule) => rule.min(0),
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
