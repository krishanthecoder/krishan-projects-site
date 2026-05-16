"use client";

import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

/** Matches `h-11` nav buttons for vertical centering math */
const NAV_BTN_PX = 44;

/** Matches `sm:` card layout — two cards per row from 640px up. */
const DESKTOP_CAROUSEL_MQ = "(min-width: 640px)";

function getSlidesPerView() {
  if (typeof window === "undefined") return 1;
  return window.matchMedia(DESKTOP_CAROUSEL_MQ).matches ? 2 : 1;
}

function chunkTestimonials<T>(items: T[], size: number): T[][] {
  if (size < 1) return [];
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size));
  }
  return pages;
}

/** Scroll within the carousel strip only — never `scrollIntoView` (that scrolls the document). */
function scrollCarouselToPage(
  root: HTMLDivElement,
  pageEl: HTMLDivElement,
  behavior: ScrollBehavior,
) {
  root.scrollTo({ left: pageEl.offsetLeft, behavior });
}

export type TestimonialForCarousel = {
  _id: string;
  clientName: string;
  jobTitle?: string | null;
  rating: number;
  content: string;
  createdAt?: string;
};

function formatPostedDate(dateString?: string) {
  if (!dateString) return null;
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return null;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

function TestimonialCard({ testimonial }: { testimonial: TestimonialForCarousel }) {
  const postedLabel = formatPostedDate(testimonial.createdAt);

  return (
    <article className="flex min-w-0 flex-1 flex-col rounded-2xl border border-graphite/8 bg-stone-white p-6 shadow-sm">
      <div
        className="flex items-center gap-1"
        aria-label={`Rating: ${testimonial.rating} out of 5`}
      >
        {Array.from({ length: 5 }).map((_, starIndex) => (
          <span
            key={`${testimonial._id}-star-${starIndex}`}
            aria-hidden="true"
            className={`text-sm leading-none ${
              starIndex < testimonial.rating ? "text-gold" : "text-gold/25"
            }`}
          >
            ★
          </span>
        ))}
      </div>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-graphite/85">{testimonial.content}</p>

      <div className="mt-5 flex items-end justify-between gap-4 border-t border-graphite/8 pt-4">
        <div>
          <p className="text-sm font-semibold text-graphite">{testimonial.clientName}</p>
          {testimonial.jobTitle ? (
            <p className="mt-0.5 text-xs text-warm-mist">{testimonial.jobTitle}</p>
          ) : null}
        </div>
        {postedLabel ? (
          <p className="shrink-0 text-xs text-warm-mist/70">{postedLabel}</p>
        ) : null}
      </div>
    </article>
  );
}

type TestimonialCarouselProps = {
  testimonials: TestimonialForCarousel[];
  /** Section heading id — links the carousel region to the visible title for assistive tech. */
  ariaLabelledBy?: string;
};

export function TestimonialCarousel({
  testimonials,
  ariaLabelledBy,
}: TestimonialCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduceMotion = useReducedMotion();
  const [slidesPerView, setSlidesPerView] = useState(() => getSlidesPerView());
  const [activePage, setActivePage] = useState(0);
  const [arrowMarginTop, setArrowMarginTop] = useState(0);

  const pages = useMemo(
    () => chunkTestimonials(testimonials, slidesPerView),
    [testimonials, slidesPerView],
  );
  const pageCount = pages.length;

  const scrollBehavior =
    reduceMotion === true ? ("instant" as const) : ("smooth" as const);

  /** Center arrows on the visible page — tallest card in the page with most viewport overlap. */
  const updateArrowAlign = useCallback(() => {
    const root = scrollRef.current;
    if (!root || pageCount === 0) {
      setArrowMarginTop(0);
      return;
    }

    const rootRect = root.getBoundingClientRect();
    let visiblePageEl: HTMLDivElement | undefined;
    let bestOverlap = -1;

    for (const page of pageRefs.current) {
      if (!page) continue;
      const r = page.getBoundingClientRect();
      const overlap =
        Math.min(r.right, rootRect.right) - Math.max(r.left, rootRect.left);
      if (overlap > bestOverlap) {
        bestOverlap = overlap;
        visiblePageEl = page;
      }
    }

    if (!visiblePageEl) {
      setArrowMarginTop(0);
      return;
    }

    const cards = visiblePageEl.querySelectorAll("article");
    let maxHeight = 0;
    cards.forEach((card) => {
      maxHeight = Math.max(maxHeight, card.getBoundingClientRect().height);
    });

    setArrowMarginTop(
      maxHeight > 0 ? Math.max(0, (maxHeight - NAV_BTN_PX) / 2) : 0,
    );
  }, [pageCount]);

  const syncActiveFromScroll = useCallback(() => {
    const root = scrollRef.current;
    if (!root || pageCount === 0) return;

    const rootRect = root.getBoundingClientRect();
    let bestPage = 0;
    let bestOverlap = -1;

    pageRefs.current.forEach((page, pageIndex) => {
      if (!page) return;
      const r = page.getBoundingClientRect();
      const overlap =
        Math.min(r.right, rootRect.right) - Math.max(r.left, rootRect.left);
      if (overlap > bestOverlap) {
        bestOverlap = overlap;
        bestPage = pageIndex;
      }
    });

    setActivePage(bestPage);
  }, [pageCount]);

  useLayoutEffect(() => {
    const mq = window.matchMedia(DESKTOP_CAROUSEL_MQ);
    const onChange = () => setSlidesPerView(getSlidesPerView());

    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useLayoutEffect(() => {
    const root = scrollRef.current;
    if (!root || pageCount === 0) return;

    setActivePage((page) => {
      const clamped = Math.min(page, Math.max(0, pageCount - 1));
      const target = pageRefs.current[clamped];
      if (target) {
        scrollCarouselToPage(root, target, "instant");
      }
      return clamped;
    });
  }, [slidesPerView, pageCount]);

  useLayoutEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    let frame = 0;
    const tick = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        syncActiveFromScroll();
        updateArrowAlign();
      });
    };

    tick();

    root.addEventListener("scroll", tick, { passive: true });
    root.addEventListener("scrollend", tick);
    window.addEventListener("resize", tick);

    const ro = new ResizeObserver(tick);
    ro.observe(root);
    pageRefs.current.forEach((page) => {
      if (page) ro.observe(page);
    });

    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener("scroll", tick);
      root.removeEventListener("scrollend", tick);
      window.removeEventListener("resize", tick);
      ro.disconnect();
    };
  }, [syncActiveFromScroll, updateArrowAlign, pages]);

  const goToPage = useCallback(
    (page: number) => {
      const root = scrollRef.current;
      const clampedPage = Math.min(Math.max(0, page), Math.max(0, pageCount - 1));
      const target = pageRefs.current[clampedPage];
      if (!root || !target) return;

      scrollCarouselToPage(root, target, scrollBehavior);
      setActivePage(clampedPage);
    },
    [pageCount, scrollBehavior],
  );

  const canPrev = activePage > 0;
  const canNext = activePage < pageCount - 1;

  const navButtonClass =
    "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-graphite/15 bg-stone-white text-graphite shadow-sm transition hover:border-gold/50 hover:text-gold disabled:pointer-events-none disabled:opacity-35";

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabelledBy ? undefined : "Client testimonials"}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <button
          type="button"
          className={`${navButtonClass} self-start`}
          style={{ marginTop: arrowMarginTop }}
          aria-label="Previous testimonials"
          disabled={!canPrev}
          onClick={() => goToPage(activePage - 1)}
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>

        <div
          ref={scrollRef}
          tabIndex={0}
          className="flex min-w-0 flex-1 snap-x snap-mandatory items-start overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-parchment [&::-webkit-scrollbar]:hidden"
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              if (canPrev) goToPage(activePage - 1);
            }
            if (e.key === "ArrowRight") {
              e.preventDefault();
              if (canNext) goToPage(activePage + 1);
            }
          }}
        >
          {pages.map((pageTestimonials, pageIndex) => {
            const firstGlobalIndex = pageIndex * slidesPerView;
            return (
              <div
                key={`testimonial-page-${pageIndex}`}
                ref={(el) => {
                  pageRefs.current[pageIndex] = el;
                }}
                id={`testimonial-page-${pageIndex}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`Page ${pageIndex + 1} of ${pageCount}`}
                className="flex w-full shrink-0 snap-start snap-always gap-6"
              >
                {pageTestimonials.map((testimonial, itemIndex) => {
                  const globalIndex = firstGlobalIndex + itemIndex;
                  return (
                    <div
                      key={testimonial._id}
                      id={`testimonial-slide-${testimonial._id}`}
                      className={
                        slidesPerView === 1
                          ? "min-w-0 flex-1"
                          : "min-w-0 flex-[0_0_calc((100%-1.5rem)/2)]"
                      }
                      aria-label={`${globalIndex + 1} of ${testimonials.length}`}
                    >
                      <TestimonialCard testimonial={testimonial} />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className={`${navButtonClass} self-start`}
          style={{ marginTop: arrowMarginTop }}
          aria-label="Next testimonials"
          disabled={!canNext}
          onClick={() => goToPage(activePage + 1)}
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>

      {pageCount > 1 ? (
        <div className="mt-6 flex justify-center">
          <span className="sr-only">
            Page {activePage + 1} of {pageCount}
          </span>
          <div className="flex gap-2">
            {Array.from({ length: pageCount }, (_, page) => (
              <button
                key={`dot-page-${page}`}
                type="button"
                aria-label={`Go to page ${page + 1} of ${pageCount}`}
                aria-current={page === activePage ? true : undefined}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  page === activePage
                    ? "scale-110 bg-gold shadow-sm"
                    : "bg-graphite/25 hover:bg-graphite/40"
                }`}
                onClick={() => goToPage(page)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
