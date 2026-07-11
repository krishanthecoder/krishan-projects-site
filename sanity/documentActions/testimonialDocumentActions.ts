import type { DocumentActionComponent } from "sanity";

import { DiscardPublishedTestimonialAction } from "./discardPublishedTestimonialAction";
import { PermanentDeleteDiscardedTestimonialAction } from "./permanentDeleteDiscardedTestimonialAction";
import { RestoreDiscardedTestimonialAction } from "./restoreDiscardedTestimonialAction";
import { mapPublishActionsToPrimaryTone } from "./primaryTonePublishAction";

type DocumentActionsContext = {
  schemaType: string;
};

const ACTIONS_HIDDEN_FOR_TESTIMONIAL = new Set([
  "publish",
  "unpublish",
  "duplicate",
  "delete",
  "schedule",
  "discardChanges",
]);

/** Customer review workflow uses custom structure panes instead of Sanity publish. */
function hideTestimonialBuiltinAction(
  original: DocumentActionComponent,
): DocumentActionComponent {
  const Wrapped: DocumentActionComponent = (props) => {
    const description = original(props);
    if (!description) return null;
    return null;
  };

  Wrapped.action = original.action;
  Wrapped.displayName = original.displayName
    ? `HideTestimonialBuiltin(${original.displayName})`
    : "HideTestimonialBuiltinAction";

  return Wrapped;
}

export function resolveDocumentActions(
  prev: DocumentActionComponent[],
  context: DocumentActionsContext,
): DocumentActionComponent[] {
  if (context.schemaType !== "testimonial") {
    return mapPublishActionsToPrimaryTone(prev);
  }

  const actions = prev.map((action) => {
    if (action.action && ACTIONS_HIDDEN_FOR_TESTIMONIAL.has(action.action)) {
      return hideTestimonialBuiltinAction(action);
    }

    return action;
  });

  return [
    ...actions,
    DiscardPublishedTestimonialAction,
    RestoreDiscardedTestimonialAction,
    PermanentDeleteDiscardedTestimonialAction,
  ];
}
