import type { DocumentActionComponent } from "sanity";

import { DiscardedTestimonialDeleteAction } from "./discardedTestimonialDeleteAction";
import { isDiscardedTestimonial } from "./discardedTestimonialStatus";
import {
  mapPublishActionsToPrimaryTone,
  withPrimaryPublishTone,
} from "./primaryTonePublishAction";

type DocumentActionsContext = {
  schemaType: string;
};

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

/** Built-in delete stays in the overflow menu for non-discarded reviews only. */
function hideBuiltInDeleteWhenDiscarded(
  original: DocumentActionComponent,
): DocumentActionComponent {
  const Wrapped: DocumentActionComponent = (props) => {
    if (isDiscardedTestimonial(props)) return null;
    return original(props);
  };

  Wrapped.action = original.action;
  Wrapped.displayName = original.displayName
    ? `HideBuiltInDeleteWhenDiscarded(${original.displayName})`
    : "HideBuiltInDeleteWhenDiscardedAction";

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
    DiscardedTestimonialDeleteAction,
    ...wrappedOthers,
    ...(deleteAction ? [hideBuiltInDeleteWhenDiscarded(deleteAction)] : []),
  ];
}
