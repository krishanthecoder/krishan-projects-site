type TestimonialDocument = {
  status?: unknown;
} & Record<string, unknown>;

export function readTestimonialStatus(
  document: TestimonialDocument | null | undefined,
): string | undefined {
  return typeof document?.status === "string" ? document.status : undefined;
}

export function isPublishedTestimonial(props: {
  draft?: TestimonialDocument | null;
  published?: TestimonialDocument | null;
}): boolean {
  const status =
    readTestimonialStatus(props.draft) ?? readTestimonialStatus(props.published);
  return !status || status === "published";
}

export function isPendingTestimonial(props: {
  draft?: TestimonialDocument | null;
  published?: TestimonialDocument | null;
}): boolean {
  const status =
    readTestimonialStatus(props.draft) ?? readTestimonialStatus(props.published);
  return status === "pending";
}

export function isDiscardedTestimonial(props: {
  draft?: TestimonialDocument | null;
  published?: TestimonialDocument | null;
}): boolean {
  const status =
    readTestimonialStatus(props.draft) ?? readTestimonialStatus(props.published);
  return status === "discarded";
}
