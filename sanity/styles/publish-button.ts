import type { CSSProperties } from "react";

/** Matches Homepage Settings custom Publish control in the structure pane. */
export const STUDIO_PUBLISH_BUTTON_BG = "#1d4ed8";

export const STUDIO_PUBLISH_BUTTON_PADDING = "10px 20px";
export const STUDIO_PUBLISH_BUTTON_FONT_SIZE = "0.875rem";
export const STUDIO_PUBLISH_BUTTON_MIN_HEIGHT = "40px";

export const studioPublishButtonStyle: CSSProperties = {
  padding: STUDIO_PUBLISH_BUTTON_PADDING,
  fontSize: STUDIO_PUBLISH_BUTTON_FONT_SIZE,
  fontWeight: 600,
  lineHeight: 1.25,
  minHeight: STUDIO_PUBLISH_BUTTON_MIN_HEIGHT,
  boxSizing: "border-box",
  color: "#fff",
  background: STUDIO_PUBLISH_BUTTON_BG,
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

export const studioDisabledPrimaryButtonStyle: CSSProperties = {
  ...studioPublishButtonStyle,
  background: "#9ca3af",
  cursor: "not-allowed",
};

export const studioCriticalButtonStyle: CSSProperties = {
  ...studioPublishButtonStyle,
  background: "#dc2626",
  color: "#fff",
};
