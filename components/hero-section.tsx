"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

// A craftsman at work — warm, detailed, conveys precision and care.
// Using a local optimized image for maximum LCP performance.
const DEFAULT_BG = "/hero-bg-opt.jpg";

type HeroSectionProps = {
  children: React.ReactNode;
  /** Override the default background image URL. */
  backgroundSrc?: string;
};

export function HeroSection({ children, backgroundSrc = DEFAULT_BG }: HeroSectionProps) {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Fade content out as section scrolls away — no transforms that affect layout
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden"
      aria-label="Site hero"
    >
      {/* ── Static background image ── */}
      <Image
        src={backgroundSrc}
        alt=""
        fill
        priority
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden="true"
      />

      {/* ── Overlay ──────────────────────────────────────────────────────────
          Heavier at top/bottom (badge and pillar cards) so graphite text stays
          legible; thinner in the middle to let the image breathe. */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-stone-white/90 via-stone-white/72 to-stone-white/88"
        aria-hidden="true"
      />

      {/* ── Content ── */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-6xl px-6 py-8 sm:px-10"
        style={{ opacity: contentOpacity }}
      >
        {children}
      </motion.div>
    </section>
  );
}
