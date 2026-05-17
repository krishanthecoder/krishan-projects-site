"use client";

import { useEffect, useState } from "react";

type UseScrollSpyOptions = {
  /** Pixels from the top of the viewport (navbar + scroll margin). */
  offset?: number | (() => number);
  enabled?: boolean;
};

/**
 * Returns the section active at the anchor line — the one whose top has crossed
 * it while the next section has not.
 */
export function useScrollSpy(
  sectionIds: string[],
  { offset = 148, enabled = true }: UseScrollSpyOptions = {},
) {
  const fallbackId = sectionIds[0] ?? "";
  const [activeId, setActiveId] = useState(fallbackId);

  useEffect(() => {
    if (!enabled || sectionIds.length === 0) return;

    let layoutRafId = 0;

    const resolveOffset = () => (typeof offset === "function" ? offset() : offset);

    const updateActiveSection = () => {
      const anchorLine = resolveOffset();
      let current = sectionIds[0];

      for (let index = 0; index < sectionIds.length; index++) {
        const id = sectionIds[index];
        const element = document.getElementById(id);
        if (!element) continue;

        const top = element.getBoundingClientRect().top;
        const nextElement =
          index + 1 < sectionIds.length
            ? document.getElementById(sectionIds[index + 1])
            : null;
        const nextTop =
          nextElement?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;

        if (top <= anchorLine && nextTop > anchorLine) {
          current = id;
          break;
        }

        if (top <= anchorLine) {
          current = id;
        }
      }

      setActiveId(current);
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

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element != null);

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(scheduleLayoutUpdate)
        : null;

    elements.forEach((element) => resizeObserver?.observe(element));

    return () => {
      cancelAnimationFrame(layoutRafId);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", scheduleLayoutUpdate);
      window.removeEventListener("load", scheduleLayoutUpdate);
      resizeObserver?.disconnect();
    };
  }, [sectionIds, offset, enabled]);

  return activeId;
}
