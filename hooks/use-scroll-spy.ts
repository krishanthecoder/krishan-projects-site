"use client";

import { useEffect, useState } from "react";

type ScrollSpyMode = "anchor" | "anchored-visibility";

type UseScrollSpyOptions = {
  /**
   * Viewport Y (px) for the activation line — e.g. the "Browse by trade" heading.
   */
  offset?: number | (() => number);
  enabled?: boolean;
  shouldSkipUpdate?: () => boolean;
  /** Element whose top edge is compared to the anchor (default: section root). */
  getMarkerElement?: (sectionId: string) => HTMLElement | null;
  /** Full section bounds for visibility (default: same as marker). */
  getSectionElement?: (sectionId: string) => HTMLElement | null;
  /**
   * `anchor` — last section whose marker has crossed the anchor line.
   * `anchored-visibility` — among started sections, pick the most visible slice
   * between the anchor and `visibilityPaneEndRatio` (better for tall sections).
   */
  mode?: ScrollSpyMode;
  visibilityPaneEndRatio?: number;
};

/** Last section whose marker top has reached or passed the anchor line. */
function getActiveSectionByAnchor(
  sectionIds: string[],
  anchorTop: number,
  getMarkerElement: (sectionId: string) => HTMLElement | null,
): string {
  let activeId = sectionIds[0];

  for (const id of sectionIds) {
    const marker = getMarkerElement(id);
    if (!marker) continue;

    if (marker.getBoundingClientRect().top <= anchorTop) {
      activeId = id;
    }
  }

  return activeId;
}

/**
 * Picks the section with the most content visible between the anchor line and
 * the lower edge of the reading pane. Uses full section bounds (not marker gates)
 * so a trade is not stuck active while the next trade already fills the screen.
 */
function getActiveSectionAnchoredVisibility(
  sectionIds: string[],
  anchorTop: number,
  getMarkerElement: (sectionId: string) => HTMLElement | null,
  getSectionElement: (sectionId: string) => HTMLElement | null,
  paneEndRatio: number,
): string {
  const paneBottom = window.innerHeight * paneEndRatio;
  let activeId = sectionIds[0];
  let maxVisible = 0;

  for (const id of sectionIds) {
    const section = getSectionElement(id);
    if (!section) continue;

    const { top: sectionTop, bottom: sectionBottom } =
      section.getBoundingClientRect();
    const visibleTop = Math.max(sectionTop, anchorTop);
    const visibleBottom = Math.min(sectionBottom, paneBottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);

    if (visibleHeight > maxVisible) {
      maxVisible = visibleHeight;
      activeId = id;
    }
  }

  if (maxVisible <= 0) {
    return getActiveSectionByAnchor(sectionIds, anchorTop, getMarkerElement);
  }

  return activeId;
}

function resolveActiveSection(
  sectionIds: string[],
  anchorTop: number,
  options: UseScrollSpyOptions,
): string {
  const getMarkerElement =
    options.getMarkerElement ?? ((id: string) => document.getElementById(id));
  const getSectionElement =
    options.getSectionElement ?? getMarkerElement;
  const mode = options.mode ?? "anchor";

  if (mode === "anchored-visibility") {
    return getActiveSectionAnchoredVisibility(
      sectionIds,
      anchorTop,
      getMarkerElement,
      getSectionElement,
      options.visibilityPaneEndRatio ?? 0.65,
    );
  }

  return getActiveSectionByAnchor(sectionIds, anchorTop, getMarkerElement);
}

export function useScrollSpy(
  sectionIds: string[],
  {
    offset = 148,
    enabled = true,
    shouldSkipUpdate,
    getMarkerElement,
    getSectionElement,
    mode = "anchor",
    visibilityPaneEndRatio,
  }: UseScrollSpyOptions = {},
) {
  const fallbackId = sectionIds[0] ?? "";
  const [activeId, setActiveId] = useState(fallbackId);

  useEffect(() => {
    if (!enabled || sectionIds.length === 0) return;

    let layoutRafId = 0;

    const resolveOffset = () => (typeof offset === "function" ? offset() : offset);

    const updateActiveSection = () => {
      if (shouldSkipUpdate?.()) return;
      setActiveId(
        resolveActiveSection(sectionIds, resolveOffset(), {
          getMarkerElement,
          getSectionElement,
          mode,
          visibilityPaneEndRatio,
        }),
      );
    };

    const scheduleLayoutUpdate = () => {
      cancelAnimationFrame(layoutRafId);
      layoutRafId = requestAnimationFrame(() => {
        layoutRafId = requestAnimationFrame(updateActiveSection);
      });
    };

    scheduleLayoutUpdate();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", scheduleLayoutUpdate);
    window.addEventListener("load", scheduleLayoutUpdate);

    const observedElements = new Set<HTMLElement>();
    for (const id of sectionIds) {
      const marker = getMarkerElement?.(id) ?? document.getElementById(id);
      const section = getSectionElement?.(id) ?? marker;
      if (marker) observedElements.add(marker);
      if (section) observedElements.add(section);
    }

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(scheduleLayoutUpdate)
        : null;

    observedElements.forEach((element) => resizeObserver?.observe(element));

    return () => {
      cancelAnimationFrame(layoutRafId);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", scheduleLayoutUpdate);
      window.removeEventListener("load", scheduleLayoutUpdate);
      resizeObserver?.disconnect();
    };
  }, [
    sectionIds,
    offset,
    enabled,
    shouldSkipUpdate,
    getMarkerElement,
    getSectionElement,
    mode,
    visibilityPaneEndRatio,
  ]);

  return activeId;
}
