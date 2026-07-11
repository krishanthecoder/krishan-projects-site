export type TestimonialStructureCounts = {
  pending: number;
  published: number;
  discarded: number;
};

export const testimonialStructureCountsQuery = `{
  "pending": count(*[_type == "testimonial" && !(_id in path("drafts.**")) && status == "pending"]),
  "published": count(*[_type == "testimonial" && !(_id in path("drafts.**")) && (!defined(status) || status == "published")]),
  "discarded": count(*[_type == "testimonial" && !(_id in path("drafts.**")) && status == "discarded"])
}`;
