export type TestimonialSummary = {
  count: number;
  averageRating: number;
};

type RatedTestimonial = {
  rating: number;
};

/** Average rating (1 decimal) and count from published Sanity testimonials. */
export function getTestimonialSummary(
  testimonials: RatedTestimonial[],
): TestimonialSummary | null {
  if (testimonials.length === 0) return null;

  const count = testimonials.length;
  const total = testimonials.reduce((sum, item) => sum + item.rating, 0);
  const averageRating = Math.round((total / count) * 10) / 10;

  return { count, averageRating };
}

export function formatAverageRating(rating: number): string {
  const rounded = Math.round(rating * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}
