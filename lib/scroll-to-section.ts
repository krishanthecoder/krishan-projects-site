/** Scroll so the element's top aligns with a viewport offset (e.g. below a sticky bar). */
export function scrollToSection(element: HTMLElement, anchorTopPx: number) {
  const delta = element.getBoundingClientRect().top - anchorTopPx;
  window.scrollBy({ top: delta, left: 0, behavior: "auto" });
}
