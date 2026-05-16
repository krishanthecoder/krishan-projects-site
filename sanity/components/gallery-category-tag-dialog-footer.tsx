"use client";

import { Flex, useToast } from "@sanity/ui";
import { useCallback, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Path } from "sanity";
import { useDialogStack } from "sanity";

import { useGalleryCategoryTagDialog } from "../lib/gallery-category-tag-dialog-context";
import { isIncompleteGalleryTag } from "../lib/gallery-tag-utils";
import { studioPublishButtonStyle } from "../styles/publish-button";

const FOOTER_ATTR = "data-kp-gallery-tag-dialog-footer";

function mountFooterHost(): HTMLElement | null {
  const dialog = document.querySelector<HTMLElement>(
    '[data-testid="nested-object-dialog"]',
  );
  if (!dialog || dialog.hasAttribute("hidden")) return null;

  const existing = dialog.querySelector<HTMLElement>(`[${FOOTER_ATTR}]`);
  if (existing) return existing;

  const scrollContent = dialog.querySelector<HTMLElement>('[tabindex="-1"]');
  const layout = scrollContent?.parentElement;
  if (!layout) return null;

  const host = document.createElement("div");
  host.setAttribute(FOOTER_ATTR, "");
  host.className = "kp-gallery-tag-dialog-footer-host";
  layout.appendChild(host);
  return host;
}

function unmountFooterHost() {
  document
    .querySelectorAll<HTMLElement>(`[${FOOTER_ATTR}]`)
    .forEach((node) => node.remove());
}

type GalleryCategoryTagDialogFooterProps = {
  open: boolean;
  path: Path;
  value: unknown;
};

/** Renders “Add tag” in the nested-object dialog footer (outside the scroll area). */
export function GalleryCategoryTagDialogFooter({
  open,
  path,
  value,
}: GalleryCategoryTagDialogFooterProps) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const dialog = useGalleryCategoryTagDialog();
  const { close } = useDialogStack({ path });
  const toast = useToast();
  const incomplete = isIncompleteGalleryTag(value);

  useLayoutEffect(() => {
    if (!open) {
      setHost(null);
      unmountFooterHost();
      return;
    }

    let frame = 0;
    const tryMount = () => {
      const nextHost = mountFooterHost();
      if (nextHost) {
        setHost(nextHost);
        return;
      }
      frame = requestAnimationFrame(tryMount);
    };

    tryMount();
    return () => {
      cancelAnimationFrame(frame);
      setHost(null);
      unmountFooterHost();
    };
  }, [open]);

  const handleAddTag = useCallback(() => {
    if (isIncompleteGalleryTag(value)) {
      toast.push({
        status: "error",
        title: "Title required",
        description: "Enter at least 2 characters for the tag title, then click Add tag.",
      });
      return;
    }
    dialog?.markAddConfirmed();
    close();
  }, [close, dialog, toast, value]);

  if (!open || !host) return null;

  return createPortal(
    <Flex
      justify="flex-end"
      padding={3}
      className="kp-gallery-tag-dialog-footer"
    >
      <button
        type="button"
        className="kp-studio-save-btn"
        onClick={handleAddTag}
        disabled={incomplete}
        style={{
          ...studioPublishButtonStyle,
          opacity: incomplete ? 0.5 : 1,
          cursor: incomplete ? "not-allowed" : "pointer",
        }}
      >
        Add tag
      </button>
    </Flex>,
    host,
  );
}
