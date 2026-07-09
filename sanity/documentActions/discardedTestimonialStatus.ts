type TestimonialActionProps = {
  draft?: { status?: string } | Record<string, unknown> | null;
  published?: { status?: string } | Record<string, unknown> | null;
};

function readStatus(props: TestimonialActionProps): string | undefined {
  const draftStatus = props.draft?.status;
  if (typeof draftStatus === "string") return draftStatus;
  const publishedStatus = props.published?.status;
  if (typeof publishedStatus === "string") return publishedStatus;
  return undefined;
}

export function isDiscardedTestimonial(props: TestimonialActionProps): boolean {
  return readStatus(props) === "discarded";
}
