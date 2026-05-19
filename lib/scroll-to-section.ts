type ScrollToSectionOptions = {
  behavior?: ScrollBehavior;
};

/** Scroll so the element's top aligns with a viewport offset (e.g. below a sticky bar). */
export function scrollToSection(
  element: HTMLElement,
  anchorTopPx: number,
  { behavior = "auto" }: ScrollToSectionOptions = {},
) {
  const { top } = element.getBoundingClientRect();
  const targetTop = Math.max(0, window.scrollY + top - anchorTopPx);
  window.scrollTo({ top: targetTop, left: 0, behavior });
}

/** Scroll to anchor and nudge again if layout shifted (sticky bars, margins, etc.). */
export function scrollToSectionAligned(
  element: HTMLElement,
  anchorTopPx: number,
  { behavior = "auto" }: ScrollToSectionOptions = {},
) {
  scrollToSection(element, anchorTopPx, { behavior });

  const delta = element.getBoundingClientRect().top - anchorTopPx;
  if (Math.abs(delta) > 2) {
    window.scrollBy({ top: delta, left: 0, behavior });
  }
}
