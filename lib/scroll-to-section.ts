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

function nudgeToAnchor(
  element: HTMLElement,
  anchorTopPx: number,
) {
  const delta = element.getBoundingClientRect().top - anchorTopPx;
  if (Math.abs(delta) > 2) {
    window.scrollBy({ top: delta, left: 0, behavior: "auto" });
  }
}

function waitForScrollSettle(onSettled: () => void) {
  let lastScrollY = window.scrollY;
  let stableFrames = 0;
  let frameId = 0;
  let settled = false;

  const finish = () => {
    if (settled) return;
    settled = true;
    cancelAnimationFrame(frameId);
    onSettled();
  };

  const poll = () => {
    const currentScrollY = window.scrollY;
    stableFrames = Math.abs(currentScrollY - lastScrollY) < 0.5 ? stableFrames + 1 : 0;
    lastScrollY = currentScrollY;

    if (stableFrames >= 4) {
      finish();
      return;
    }

    frameId = requestAnimationFrame(poll);
  };

  frameId = requestAnimationFrame(poll);
  window.setTimeout(finish, 900);
}

/** Scroll to anchor and nudge again after layout / smooth scrolling settles. */
export function scrollToSectionAligned(
  element: HTMLElement,
  anchorTopPx: number,
  { behavior = "auto" }: ScrollToSectionOptions = {},
) {
  scrollToSection(element, anchorTopPx, { behavior });

  const finalize = () => {
    nudgeToAnchor(element, anchorTopPx);
    requestAnimationFrame(() => nudgeToAnchor(element, anchorTopPx));
  };

  if (behavior === "auto") {
    requestAnimationFrame(() => requestAnimationFrame(finalize));
    return;
  }

  waitForScrollSettle(finalize);
}

/** Bottom edge of the sticky site header plus a small content gap. */
export function getSiteHeaderScrollOffset(extraGapPx = 12) {
  const header = document.querySelector("header");
  if (!header) return 112;
  return header.getBoundingClientRect().bottom + extraGapPx;
}
