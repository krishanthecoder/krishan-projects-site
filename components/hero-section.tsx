"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { HERO_DEFAULT_BACKGROUND } from "@/lib/hero-defaults";

type HeroSectionProps = {
  children: React.ReactNode;
  /** Sanity desktop hero URL; omit for default stone background. */
  backgroundSrcDesktop?: string;
  /** Sanity mobile hero URL; falls back to desktop when omitted. */
  backgroundSrcMobile?: string;
};

export function HeroSection({
  children,
  backgroundSrcDesktop,
  backgroundSrcMobile,
}: HeroSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const mobileSrc = backgroundSrcMobile ?? backgroundSrcDesktop;
  const showBackgroundImage = Boolean(backgroundSrcDesktop || mobileSrc);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Fade content out as section scrolls away — no transforms that affect layout
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 1]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[calc(100svh-5rem)] items-start overflow-hidden py-16 sm:min-h-[calc(100vh-5rem)] sm:py-20 min-[1300px]:min-h-[calc(100vh-3rem)] min-[1300px]:py-20"
      aria-label="Site hero"
    >
      <div
        className="absolute inset-0"
        style={{ backgroundColor: HERO_DEFAULT_BACKGROUND }}
        aria-hidden="true"
      />

      {showBackgroundImage ? (
        <picture className="pointer-events-none absolute inset-0">
          {mobileSrc ? <source media="(max-width: 767px)" srcSet={mobileSrc} /> : null}
          {backgroundSrcDesktop ? (
            <img
              src={backgroundSrcDesktop}
              alt=""
              className="h-full w-full object-cover object-center"
              loading="eager"
              fetchPriority="high"
              aria-hidden="true"
            />
          ) : null}
        </picture>
      ) : null}

      {/* ── Overlay ────────────────────────────────────────────────────────── */}
      {/* Global dark tint over the hero image */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/22 via-black/28 to-black/36"
        aria-hidden="true"
      />
      {/* Readability veil: top-weighted on mobile, left-weighted from sm up */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-stone-white/95 via-stone-white/72 to-stone-white/28 sm:bg-gradient-to-r sm:from-stone-white/96 sm:via-stone-white/78 sm:to-stone-white/24"
        aria-hidden="true"
      />

      {/* Curved transition into next section */}
      <svg
        className="pointer-events-none absolute bottom-0 left-0 z-[1] h-44 w-full sm:h-48 min-[1300px]:hidden"
        viewBox="0 0 1000 240"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Below 1300px: immediate curvature (no flat shoulders), aligned near card divider */}
        <path
          d="M0 2 C 130 112, 370 158, 500 158 C 630 158, 870 112, 1000 2 L1000 240 L0 240 Z"
          fill="#F9F9F8"
        />
      </svg>
      <svg
        className="pointer-events-none absolute bottom-0 left-0 z-[1] hidden h-20 w-full sm:h-24 min-[1300px]:block"
        viewBox="0 0 1000 240"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* 1300px and above: keep the previous desktop curve shape */}
        <path
          d="M0 2 C 130 112, 370 158, 500 158 C 630 158, 870 112, 1000 2 L1000 240 L0 240 Z"
          fill="#F9F9F8"
        />
      </svg>

      {/* ── Content ── */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-6xl px-6 sm:px-10 min-[1300px]:pb-7"
        style={{ opacity: contentOpacity }}
      >
        {children}
      </motion.div>
    </section>
  );
}
