"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Optimized local hero assets for responsive loading.
const DEFAULT_BG_DESKTOP = "/hero-bg-desktop.jpg";
const DEFAULT_BG_MOBILE = "/hero-bg-mobile.jpg";

type HeroSectionProps = {
  children: React.ReactNode;
  /** Optional desktop hero image override. */
  backgroundSrcDesktop?: string;
  /** Optional mobile hero image override. */
  backgroundSrcMobile?: string;
};

export function HeroSection({
  children,
  backgroundSrcDesktop = DEFAULT_BG_DESKTOP,
  backgroundSrcMobile = DEFAULT_BG_MOBILE,
}: HeroSectionProps) {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Fade content out as section scrolls away — no transforms that affect layout
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 1]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[calc(100vh-5rem)] items-start overflow-hidden pt-16 sm:pt-20"
      aria-label="Site hero"
    >
      {/* ── Static responsive background image ── */}
      <picture className="absolute inset-0">
        <source media="(max-width: 767px)" srcSet={backgroundSrcMobile} />
        <img
          src={backgroundSrcDesktop}
          alt=""
          className="h-full w-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
          aria-hidden="true"
        />
      </picture>

      {/* ── Overlay ────────────────────────────────────────────────────────── */}
      {/* Global dark tint over the hero image */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/22 via-black/28 to-black/36"
        aria-hidden="true"
      />
      {/* Left-side readability veil so dark text remains legible */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-stone-white/96 via-stone-white/78 to-stone-white/24"
        aria-hidden="true"
      />

      {/* Curved transition into next section */}
      <svg
        className="pointer-events-none absolute bottom-0 left-0 z-[1] h-36 w-full"
        viewBox="0 0 1000 240"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Deeper downward curve (dips in the center) */}
        <path
          d="M0 0 C 250 200, 750 200, 1000 0 L1000 240 L0 240 Z"
          fill="#F9F9F8"
        />
      </svg>

      {/* ── Content ── */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-8 sm:px-10 sm:pb-12"
        style={{ opacity: contentOpacity }}
      >
        {children}
      </motion.div>
    </section>
  );
}
