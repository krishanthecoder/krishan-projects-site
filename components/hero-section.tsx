"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import type { SanityImage as SanityImageType } from "@/lib/sanity.queries";

import { SanityImage } from "./sanity-image";

// ── Types ─────────────────────────────────────────────────────────────────────

type HeroSectionProps = {
  /** First image shown left, second shown right. */
  images?: (SanityImageType | null | undefined)[];
  headline?: string;
  subheadline?: string;
  /** Aggregate star rating from testimonials (1–5). */
  averageRating?: number | null;
  /** Total review count. */
  reviewCount?: number;
  /** Bottom trust/warranty line. */
  trustLine?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

// ── Sub-components ─────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  const rounded = Math.round(rating * 2) / 2; // half-star precision
  return (
    <div className="flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          className={i < rounded ? "text-gold" : "text-gold/25"}
          fill="currentColor"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

/** Shown when no Sanity image is connected — subtle architectural line art */
function FallbackDecor({ side }: { side: "left" | "right" }) {
  const flip = side === "right" ? "scale-x-[-1]" : "";
  return (
    <div className={`h-full w-full ${flip}`} aria-hidden="true">
      <svg
        viewBox="0 0 320 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        preserveAspectRatio="xMidYMax meet"
      >
        {/* Abstract building silhouette */}
        <rect x="60" y="160" width="80" height="400" rx="2" fill="#C4973D" fillOpacity="0.08" />
        <rect x="80" y="120" width="40" height="440" rx="2" fill="#C4973D" fillOpacity="0.06" />
        <rect x="170" y="240" width="100" height="320" rx="2" fill="#333333" fillOpacity="0.05" />
        <rect x="190" y="200" width="60" height="360" rx="2" fill="#333333" fillOpacity="0.04" />
        {/* Horizontal rule lines */}
        <line x1="40" y1="320" x2="280" y2="320" stroke="#C4973D" strokeWidth="1" strokeOpacity="0.2" />
        <line x1="40" y1="380" x2="280" y2="380" stroke="#333333" strokeWidth="1" strokeOpacity="0.1" />
        <line x1="40" y1="440" x2="280" y2="440" stroke="#333333" strokeWidth="1" strokeOpacity="0.1" />
        {/* Corner detail */}
        <path d="M60 160 L60 100 L120 100" stroke="#C4973D" strokeWidth="2" strokeOpacity="0.3" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function HeroSection({
  images = [],
  headline = "Premium Construction for Every Project",
  subheadline = "Trusted builders delivering quality craftsmanship across the region.",
  averageRating,
  reviewCount = 0,
  trustLine = "Fully Insured & Certified",
  primaryCta = { label: "Get a Free Quote", href: "#contact" },
  secondaryCta = { label: "View Our Projects", href: "#projects" },
}: HeroSectionProps) {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Left panel drifts up slightly faster — enhances depth vs right panel
  const leftY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const rightY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  // Center content fades & lifts as user scrolls away
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  const leftImage = images[0];
  const rightImage = images[1];
  const showTrustBadge = averageRating != null && reviewCount > 0;

  return (
    <section
      ref={ref}
      className="relative flex min-h-[88vh] items-center overflow-hidden bg-parchment"
      aria-label="Site hero"
    >

      {/* ── Left image panel ──────────────────────────────────────────────────
          Absolutely positioned, full-height, bleeds to the left edge.
          A right-facing gradient fades the image into the parchment background
          so the panel merges cleanly with the center content. */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 top-0 hidden w-[28%] max-w-[340px] overflow-hidden lg:block"
        aria-hidden="true"
      >
        <motion.div className="absolute inset-x-0 -top-[15%] bottom-[-15%]" style={{ y: leftY }}>
          {leftImage ? (
            <SanityImage
              image={leftImage}
              alt=""
              fill
              priority
              quality={85}
              sizes="340px"
              className="object-cover object-center"
            />
          ) : (
            <FallbackDecor side="left" />
          )}
        </motion.div>
        {/* Gradient fade toward the center */}
        <div className="absolute inset-0 bg-gradient-to-r from-parchment/10 via-transparent to-parchment" />
      </div>

      {/* ── Right image panel ─────────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 top-0 hidden w-[28%] max-w-[340px] overflow-hidden lg:block"
        aria-hidden="true"
      >
        <motion.div className="absolute inset-x-0 -top-[15%] bottom-[-15%]" style={{ y: rightY }}>
          {rightImage ? (
            <SanityImage
              image={rightImage}
              alt=""
              fill
              priority
              quality={85}
              sizes="340px"
              className="object-cover object-center"
            />
          ) : (
            <FallbackDecor side="right" />
          )}
        </motion.div>
        {/* Gradient fade toward the center */}
        <div className="absolute inset-0 bg-gradient-to-l from-parchment/10 via-transparent to-parchment" />
      </div>

      {/* ── Centre content ────────────────────────────────────────────────── */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-xl px-6 py-28 text-center sm:px-10 sm:py-36"
        style={{ y: contentY, opacity: contentOpacity }}
      >

        {/* Trust badge */}
        {showTrustBadge ? (
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-stone-white/80 px-4 py-1.5 backdrop-blur-sm">
            <StarRating rating={averageRating!} />
            <span className="text-xs font-semibold text-graphite">
              {averageRating!.toFixed(1)} Stars
            </span>
            <span className="text-xs text-warm-mist">
              from {reviewCount} review{reviewCount !== 1 ? "s" : ""}
            </span>
          </div>
        ) : (
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-stone-white/80 px-4 py-1.5 backdrop-blur-sm">
            <StarRating rating={5} />
            <span className="text-xs font-semibold text-graphite">Award-Winning Construction</span>
          </div>
        )}

        {/* Headline */}
        <h1 className="text-4xl font-bold tracking-tight text-graphite sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
          {headline}
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-4 max-w-sm text-base leading-relaxed text-warm-mist sm:text-lg">
          {subheadline}
        </p>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={primaryCta.href}
            className="inline-flex items-center justify-center rounded-full bg-graphite px-7 py-3 text-sm font-semibold text-stone-white shadow-sm transition-colors hover:bg-graphite/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-parchment"
          >
            {primaryCta.label}
          </a>
          <a
            href={secondaryCta.href}
            className="inline-flex items-center justify-center rounded-full border border-graphite/25 bg-stone-white/70 px-7 py-3 text-sm font-semibold text-graphite backdrop-blur-sm transition-colors hover:border-graphite/40 hover:bg-stone-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-parchment"
          >
            {secondaryCta.label}
          </a>
        </div>

        {/* Bottom trust line */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-warm-mist">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 text-sage"
            aria-hidden="true"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="M22 4 12 14.01l-3-3" />
          </svg>
          <span>{trustLine}</span>
        </div>
      </motion.div>

      {/* ── Scroll indicator ─────────────────────────────────────────────── */}
      <motion.div
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1"
        style={{ opacity: indicatorOpacity }}
        aria-hidden="true"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-warm-mist/60">
          Scroll
        </span>
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="text-warm-mist/50"
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <path
            d="M3 5.5L8 10.5L13 5.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.div>
    </section>
  );
}
