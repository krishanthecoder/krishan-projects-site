import { defineField, defineType } from "sanity";

import { StarRatingInput } from "../components/star-rating-input";

const testimonialStatusOptions = [
  { title: "Published", value: "published" },
  { title: "Pending review", value: "pending" },
  { title: "Discarded", value: "discarded" },
] as const;

export const testimonialSchema = defineType({
  name: "testimonial",
  title: "Customer Reviews",
  type: "document",
  fields: [
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      description: "Managed by the Customer Reviews lists — not edited here.",
      options: {
        list: [...testimonialStatusOptions],
        layout: "radio",
      },
      initialValue: "published",
      validation: (rule) => rule.required(),
      hidden: true,
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      options: {
        list: [
          { title: "Customer form", value: "customer-form" },
          { title: "Manual / Studio", value: "manual" },
          { title: "Checkatrade import", value: "checkatrade-import" },
        ],
      },
      initialValue: "manual",
    }),
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
  preview: {
    select: {
      title: "clientName",
      subtitle: "jobTitle",
      status: "status",
      rating: "rating",
    },
    prepare({ title, subtitle, status, rating }) {
      const statusLabel =
        status === "pending"
          ? "Pending"
          : status === "discarded"
            ? "Discarded"
            : "Published";

      return {
        title: title || "Untitled review",
        subtitle: [statusLabel, subtitle, rating ? `${rating}/5` : null]
          .filter(Boolean)
          .join(" · "),
      };
    },
  },
});
