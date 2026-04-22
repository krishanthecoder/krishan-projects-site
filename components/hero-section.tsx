"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import type { SanityImage as SanityImageType } from "@/lib/sanity.queries";

import { SanityImage } from "./sanity-image";

type HeroSectionProps = {
  /** Optional Sanity image used as the parallax background */
  image?: SanityImageType | null;
  children: React.ReactNode;
};

export function HeroSection({ image, children }: HeroSectionProps) {
  const ref = useRef<HTMLElement>(null);

  /**
   * Track scroll progress only while this hero is in view.
   * "start start" → when the top of the section hits the top of the viewport
   * "end start"   → when the bottom of the section reaches the top of the viewport
   */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Background moves up at ~30% the scroll rate — classic parallax depth cue
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  // Content drifts up gently and fades — makes hero feel anchored while page scrolls
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  // Scroll indicator fades away quickly
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[88vh] items-center overflow-hidden"
      aria-label="Site hero"
    >
      {/* ── Parallax background layer ──
          Oversized vertically (-15% top, 130% height) so there's always
          image to show as the transform moves it up during scroll. */}
      <motion.div
        className="absolute inset-x-0 -top-[15%] h-[130%]"
        style={{ y: bgY }}
        aria-hidden="true"
      >
        {image ? (
          <SanityImage
            image={image}
            alt=""
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          /* Fallback: warm stone-to-parchment gradient so the section
             still looks intentional without a Sanity image connected */
          <div className="h-full w-full bg-gradient-to-br from-[#DDD9CE] via-parchment to-[#C8C3B8]" />
        )}
      </motion.div>

      {/* ── Light & Airy overlay ──
          Stone-white at top/bottom, thinner in the middle so the image
          shows through without darkening the text-bearing areas. */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-stone-white/92 via-stone-white/58 to-stone-white/90"
        aria-hidden="true"
      />

      {/* ── Hero content ── */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-6xl px-6 py-28 sm:px-10 sm:py-36"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {children}
      </motion.div>

      {/* ── Scroll-down indicator ── */}
      <motion.div
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1"
        style={{ opacity: indicatorOpacity }}
        aria-hidden="true"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-warm-mist/70">
          Scroll
        </span>
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="text-warm-mist/60"
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
