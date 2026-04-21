import { defineField, defineType } from "sanity";

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
        {
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
          ],
        },
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
      name: "services",
      title: "Services",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
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
