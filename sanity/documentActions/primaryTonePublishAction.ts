import type { DocumentActionComponent } from "sanity";

/**
 * Sanity's built-in publish action uses `tone: "default"` (gray when idle/disabled).
 * Homepage Settings uses a custom blue Publish button — apply `primary` tone everywhere.
 */
export function withPrimaryPublishTone(
  original: DocumentActionComponent,
): DocumentActionComponent {
  const Wrapped: DocumentActionComponent = (props) => {
    const description = original(props);
    if (!description) return null;
    return { ...description, tone: "primary" };
  };

  Wrapped.action = original.action;
  Wrapped.displayName = original.displayName
    ? `PrimaryTone(${original.displayName})`
    : "PrimaryTonePublishAction";

  return Wrapped;
}

export function mapPublishActionsToPrimaryTone(
  actions: DocumentActionComponent[],
): DocumentActionComponent[] {
  return actions.map((action) =>
    action.action === "publish" ? withPrimaryPublishTone(action) : action,
  );
}
