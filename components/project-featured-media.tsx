"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useId, useRef, useState } from "react";

import { SanityImage } from "@/components/sanity-image";
import { buildImageAltText } from "@/lib/project-image-alt";
import type { SanityImage as SanityImageType } from "@/lib/sanity.queries";

type ProjectFeaturedMediaProps = {
  afterImage: SanityImageType;
  beforeImage: SanityImageType;
  useSlider: boolean;
  projectTitle: string;
  projectLocation?: string;
  services: string[];
  afterAltFromCms?: string;
  beforeAltFromCms?: string;
};

const HERO_SIZES = "(max-width: 768px) 100vw, 90vw";

/** Matches side-by-side hero pills — reused on the comparison slider. */
const beforeAfterLabelBefore =
  "rounded-full bg-graphite/85 px-3 py-1 text-xs font-bold uppercase tracking-wide text-stone-white";
const beforeAfterLabelAfter =
  "rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-stone-white";

/** Matches the circular handle `border-2` (2px). */
const comparisonDividerGoldClass = "w-0.5";
const comparisonDividerWhiteClass = "w-1.5";

export function ProjectFeaturedMedia({
  afterImage,
  beforeImage,
  useSlider,
  projectTitle,
  projectLocation,
  services,
  afterAltFromCms,
  beforeAltFromCms,
}: ProjectFeaturedMediaProps) {
  const afterAlt = buildImageAltText(
    afterAltFromCms,
    projectTitle,
    services,
    projectLocation,
  );
  const beforeAlt = buildImageAltText(
    beforeAltFromCms,
    projectTitle,
    services,
    projectLocation,
  );

  if (useSlider) {
    return (
      <FeaturedComparisonSlider
        afterImage={afterImage}
        beforeImage={beforeImage}
        afterAlt={afterAlt}
        beforeAlt={beforeAlt}
      />
    );
  }

  return (
    <FeaturedSideBySide
      afterImage={afterImage}
      beforeImage={beforeImage}
      afterAlt={afterAlt}
      beforeAlt={beforeAlt}
    />
  );
}

function FeaturedSideBySide({
  afterImage,
  beforeImage,
  afterAlt,
  beforeAlt,
}: {
  afterImage: SanityImageType;
  beforeImage: SanityImageType;
  afterAlt: string;
  beforeAlt: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
      <figure className="relative h-64 overflow-hidden rounded-2xl border border-graphite/10 shadow-md sm:h-[22rem]">
        <span className={`absolute left-4 top-4 z-[1] ${beforeAfterLabelBefore}`}>Before</span>
        <SanityImage
          image={beforeImage}
          alt={beforeAlt}
          fill
          priority
          sizes={HERO_SIZES}
          className="object-cover"
        />
      </figure>
      <figure className="relative h-64 overflow-hidden rounded-2xl border border-graphite/10 shadow-md sm:h-[22rem]">
        <span className={`absolute left-4 top-4 z-[1] ${beforeAfterLabelAfter}`}>After</span>
        <SanityImage
          image={afterImage}
          alt={afterAlt}
          fill
          priority
          sizes={HERO_SIZES}
          className="object-cover"
        />
      </figure>
    </div>
  );
}

function FeaturedComparisonSlider({
  afterImage,
  beforeImage,
  afterAlt,
  beforeAlt,
}: {
  afterImage: SanityImageType;
  beforeImage: SanityImageType;
  afterAlt: string;
  beforeAlt: string;
}) {
  const [splitPct, setSplitPct] = useState(50);
  const draggingRef = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const labelId = useId();

  const setFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const pct = rect.width > 0 ? Math.round((x / rect.width) * 100) : 50;
    setSplitPct(pct);
  }, []);

  const onPointerDownTrack = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };

  const onPointerDownHandle = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const track = trackRef.current;
    if (!track) return;
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    setFromClientX(e.clientX);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const clipRight = `${100 - splitPct}%`;

  return (
    <div>
      <span id={labelId} className="sr-only">
        Before and after comparison. Drag across the photo or use the hidden slider control to move
        the divider. Before is on the left, after on the right.
      </span>

      <div
        ref={trackRef}
        className="relative h-72 cursor-ew-resize touch-none overflow-hidden rounded-3xl border border-graphite/10 shadow-md sm:h-[28rem]"
        onPointerDown={onPointerDownTrack}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="group"
        aria-labelledby={labelId}
      >
        <div className="pointer-events-none absolute inset-0">
          <SanityImage
            image={afterImage}
            alt={afterAlt}
            fill
            priority
            sizes={HERO_SIZES}
            className="object-cover"
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0"
          style={{ clipPath: `inset(0 ${clipRight} 0 0)` }}
        >
          <SanityImage
            image={beforeImage}
            alt={beforeAlt}
            fill
            priority
            sizes={HERO_SIZES}
            className="object-cover"
          />
        </div>

        {/* Wide touch strip + visible divider + handle */}
        <div
          className="absolute inset-y-0 z-20 flex w-16 -translate-x-1/2 cursor-ew-resize touch-none select-none items-center justify-center sm:w-12"
          style={{ left: `${splitPct}%` }}
          onPointerDown={onPointerDownHandle}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          role="slider"
          aria-label="Drag to compare before and after"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={splitPct}
        >
          <div
            className={`pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 bg-stone-white shadow-[0_0_0_1px_rgba(0,0,0,0.12),0_0_16px_rgba(0,0,0,0.35)] ${comparisonDividerWhiteClass}`}
            aria-hidden
          />
          <div
            className={`pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 bg-gold ${comparisonDividerGoldClass}`}
            aria-hidden
          />
          <div
            className="relative flex h-14 w-14 items-center justify-center gap-0 rounded-full border-2 border-gold bg-stone-white shadow-[0_6px_24px_rgba(0,0,0,0.32)] ring-4 ring-stone-white/90 active:scale-95 sm:h-12 sm:w-12 sm:ring-2"
            aria-hidden
          >
            <ChevronLeft className="size-4 shrink-0 text-graphite sm:size-[15px]" strokeWidth={2.5} />
            <ChevronRight
              className="-ml-0.5 size-4 shrink-0 text-graphite sm:size-[15px]"
              strokeWidth={2.5}
            />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-between px-5 pt-5 sm:px-7 sm:pt-6">
          <span className={beforeAfterLabelBefore}>Before</span>
          <span className={beforeAfterLabelAfter}>After</span>
        </div>
      </div>

      <label htmlFor={`${labelId}-range`} className="sr-only">
        Divider position for before and after comparison
      </label>
      <input
        id={`${labelId}-range`}
        type="range"
        min={0}
        max={100}
        value={splitPct}
        onChange={(e) => setSplitPct(Number(e.target.value))}
        className="sr-only"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={splitPct}
        aria-labelledby={labelId}
      />
    </div>
  );
}
