"use client";

import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";

/** Matches `h-11` nav buttons for vertical centering math */
const NAV_BTN_PX = 44;

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
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [arrowMarginTop, setArrowMarginTop] = useState(0);

  const scrollBehavior =
    reduceMotion === true ? ("instant" as const) : ("smooth" as const);

  /** Center arrows on the visible card row — max height of slides overlapping the viewport strip (not the tallest slide off-screen). */
  const updateArrowAlign = useCallback(() => {
    const root = scrollRef.current;
    if (!root || testimonials.length === 0) {
      setArrowMarginTop(0);
      return;
    }

    const rootRect = root.getBoundingClientRect();
    let maxVisibleHeight = 0;

    for (const slide of slideRefs.current) {
      if (!slide) continue;
      const r = slide.getBoundingClientRect();
      const overlapX =
        Math.min(r.right, rootRect.right) - Math.max(r.left, rootRect.left);
      if (overlapX <= 12) continue;
      maxVisibleHeight = Math.max(maxVisibleHeight, r.height);
    }

    setArrowMarginTop(
      maxVisibleHeight > 0
        ? Math.max(0, (maxVisibleHeight - NAV_BTN_PX) / 2)
        : 0,
    );
  }, [testimonials.length]);

  const syncActiveFromScroll = useCallback(() => {
    const root = scrollRef.current;
    if (!root) return;
    const rootRect = root.getBoundingClientRect();
    let best = 0;
    let bestOverlap = -1;

    slideRefs.current.forEach((slide, i) => {
      if (!slide) return;
      const r = slide.getBoundingClientRect();
      const overlap =
        Math.min(r.right, rootRect.right) - Math.max(r.left, rootRect.left);
      if (overlap > bestOverlap) {
        bestOverlap = overlap;
        best = i;
      }
    });
    setActiveIndex(best);
  }, []);

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
    window.addEventListener("resize", tick);

    const ro = new ResizeObserver(tick);
    ro.observe(root);
    slideRefs.current.forEach((slide) => {
      if (slide) ro.observe(slide);
    });

    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener("scroll", tick);
      window.removeEventListener("resize", tick);
      ro.disconnect();
    };
  }, [syncActiveFromScroll, updateArrowAlign, testimonials.length]);

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.min(Math.max(0, index), testimonials.length - 1);
      const slide = slideRefs.current[clamped];
      slide?.scrollIntoView({
        behavior: scrollBehavior,
        inline: "start",
        block: "nearest",
      });
      setActiveIndex(clamped);
    },
    [scrollBehavior, testimonials.length],
  );

  const canPrev = activeIndex > 0;
  const canNext = activeIndex < testimonials.length - 1;

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
          onClick={() => goTo(activeIndex - 1)}
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>

        <div
          ref={scrollRef}
          tabIndex={0}
          className="flex min-w-0 flex-1 snap-x snap-mandatory items-start gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-parchment [&::-webkit-scrollbar]:hidden"
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              if (canPrev) goTo(activeIndex - 1);
            }
            if (e.key === "ArrowRight") {
              e.preventDefault();
              if (canNext) goTo(activeIndex + 1);
            }
          }}
        >
          {testimonials.map((testimonial, index) => {
            const postedLabel = formatPostedDate(testimonial.createdAt);
            return (
              <div
                key={testimonial._id}
                ref={(el) => {
                  slideRefs.current[index] = el;
                }}
                id={`testimonial-slide-${testimonial._id}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${testimonials.length}`}
                className="snap-start shrink-0 grow-0 basis-full sm:basis-[calc((100%-1.5rem)/2)]"
              >
                <article className="flex flex-col rounded-2xl border border-graphite/8 bg-stone-white p-6 shadow-sm">
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

                  <p className="mt-4 flex-1 text-sm leading-relaxed text-graphite/85">
                    {testimonial.content}
                  </p>

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
          onClick={() => goTo(activeIndex + 1)}
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div className="mt-6 flex justify-center">
        <span className="sr-only">
          Slide {activeIndex + 1} of {testimonials.length}
        </span>
        <div className="flex gap-2">
          {testimonials.map((t, i) => (
            <button
              key={`dot-${t._id}`}
              type="button"
              aria-label={`Go to testimonial ${i + 1}`}
              aria-current={i === activeIndex ? true : undefined}
              className={`h-2.5 w-2.5 rounded-full transition ${
                i === activeIndex ? "scale-110 bg-gold shadow-sm" : "bg-graphite/25 hover:bg-graphite/40"
              }`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
