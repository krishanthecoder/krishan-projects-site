import type { SanityClient } from "sanity";

export const TESTIMONIAL_WORKFLOW_CHANGED_EVENT = "kp-testimonial-workflow-changed";

export type TestimonialWorkflowChangedDetail = {
  documentId?: string;
  status?: string;
};

export function notifyTestimonialWorkflowChanged(
  detail?: TestimonialWorkflowChangedDetail,
): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(TESTIMONIAL_WORKFLOW_CHANGED_EVENT, { detail }));
}

export function publishedTestimonialId(id: string): string {
  return id.replace(/^drafts\./, "");
}

export function draftTestimonialId(publishedId: string): string {
  return `drafts.${publishedTestimonialId(publishedId)}`;
}

type WorkflowPatch = Record<string, unknown>;

type MismatchedTestimonialDraft = {
  _id: string;
  status: string;
  draftStatus: string;
};

const mismatchedDraftsQuery = `*[_type == "testimonial" && !(_id in path("drafts.**")) && defined(status)]{
  _id,
  status,
  "draftStatus": *[_id == "drafts." + ^._id][0].status
}[defined(draftStatus) && draftStatus != status]{ _id }`;

/**
 * Remove Studio drafts that still hold an old workflow status after list actions
 * updated the published document (e.g. discarded on published, pending on draft).
 */
export async function repairStaleTestimonialDrafts(client: SanityClient): Promise<void> {
  const mismatched = await client.fetch<MismatchedTestimonialDraft[]>(mismatchedDraftsQuery);
  if (mismatched.length === 0) return;

  const transaction = client.transaction();
  for (const doc of mismatched) {
    transaction.delete(draftTestimonialId(doc._id));
  }
  await transaction.commit();
}

/**
 * Apply workflow changes on the published document and remove any stale Studio
 * draft so structure lists and counters stay in sync.
 */
export async function commitTestimonialWorkflow(
  client: SanityClient,
  id: string,
  patch: WorkflowPatch,
): Promise<void> {
  const publishedId = publishedTestimonialId(id);
  const draftId = draftTestimonialId(publishedId);

  const transaction = client.transaction().patch(publishedId, (builder) => builder.set(patch));

  const draft = await client.getDocument(draftId);
  if (draft) {
    transaction.delete(draftId);
  }

  await transaction.commit();
  notifyTestimonialWorkflowChanged({
    documentId: publishedId,
    status: typeof patch.status === "string" ? patch.status : undefined,
  });
}
