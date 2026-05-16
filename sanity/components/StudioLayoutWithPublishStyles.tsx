import type { LayoutProps } from "sanity";

import "../studio.css";

/** Injects global Publish button styles for the embedded Studio. */
export function StudioLayoutWithPublishStyles(props: LayoutProps) {
  return props.renderDefault(props);
}
