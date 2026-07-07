export type TestimonialStructureCounts = {
  pending: number;
  published: number;
  discarded: number;
};

export const testimonialStructureCountsQuery = `{
  "pending": count(*[_type == "testimonial" && status == "pending"]),
  "published": count(*[_type == "testimonial" && (!defined(status) || status == "published")]),
  "discarded": count(*[_type == "testimonial" && status == "discarded"])
}`;
