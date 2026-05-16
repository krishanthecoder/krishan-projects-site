import { defineField, defineType } from "sanity";

import { StarRatingInput } from "../components/star-rating-input";

export const testimonialSchema = defineType({
  name: "testimonial",
  title: "Testimonials",
  type: "document",
  fields: [
    defineField({
      name: "clientName",
      title: "Client Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      components: {
        input: StarRatingInput,
      },
      initialValue: 5,
      validation: (rule) => rule.required().min(1).max(5),
    }),
    defineField({
      name: "jobTitle",
      title: "Job Title",
      type: "string",
      description: "Example: Full Bathroom Renovation in Ilford",
      validation: (rule) => rule.required().min(5),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().min(10),
    }),
  ],
});
