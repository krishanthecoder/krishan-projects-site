import type { DocumentActionComponent } from "sanity";

import {
  mapPublishActionsToPrimaryTone,
  withPrimaryPublishTone,
} from "./primaryTonePublishAction";

type DocumentActionsContext = {
  schemaType: string;
};

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

function isDiscardedTestimonial(props: TestimonialActionProps): boolean {
  return readStatus(props) === "discarded";
}

function hideWhenDiscarded(
  original: DocumentActionComponent,
): DocumentActionComponent {
  const Wrapped: DocumentActionComponent = (props) => {
    if (isDiscardedTestimonial(props)) return null;
    return original(props);
  };

  Wrapped.action = original.action;
  Wrapped.displayName = original.displayName
    ? `HideWhenDiscarded(${original.displayName})`
    : "HideWhenDiscardedAction";

  return Wrapped;
}

/** Primary red Delete when status is discarded. */
function showDeleteWhenDiscardedOnly(
  original: DocumentActionComponent,
): DocumentActionComponent {
  const Wrapped: DocumentActionComponent = (props) => {
    if (!isDiscardedTestimonial(props)) return null;
    const description = original(props);
    if (!description) return null;
    return { ...description, tone: "critical" };
  };

  Wrapped.action = original.action;
  Wrapped.displayName = original.displayName
    ? `DiscardedPrimaryDelete(${original.displayName})`
    : "DiscardedPrimaryDeleteAction";

  return Wrapped;
}

/** Keep overflow-menu delete for non-discarded reviews only. */
function hideDeleteWhenDiscarded(
  original: DocumentActionComponent,
): DocumentActionComponent {
  const Wrapped: DocumentActionComponent = (props) => {
    if (isDiscardedTestimonial(props)) return null;
    return original(props);
  };

  Wrapped.action = original.action;
  Wrapped.displayName = original.displayName
    ? `HideDeleteWhenDiscarded(${original.displayName})`
    : "HideDeleteWhenDiscardedAction";

  return Wrapped;
}

/**
 * Discarded reviews: one primary Delete button, no publish / overflow actions.
 * Status is read from action props (draft/published), not the actions resolver context.
 */
export function resolveDocumentActions(
  prev: DocumentActionComponent[],
  context: DocumentActionsContext,
): DocumentActionComponent[] {
  if (context.schemaType !== "testimonial") {
    return mapPublishActionsToPrimaryTone(prev);
  }

  const deleteAction = prev.find((action) => action.action === "delete");
  const others = prev.filter((action) => action.action !== "delete");

  const wrappedOthers = others.map((action) =>
    hideWhenDiscarded(
      action.action === "publish" ? withPrimaryPublishTone(action) : action,
    ),
  );

  return [
    ...(deleteAction ? [showDeleteWhenDiscardedOnly(deleteAction)] : []),
    ...wrappedOthers,
    ...(deleteAction ? [hideDeleteWhenDiscarded(deleteAction)] : []),
  ];
}
