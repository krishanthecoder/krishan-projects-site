"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type HeroSectionProps = {
  children: React.ReactNode;
};

export function HeroSection({ children }: HeroSectionProps) {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Content drifts up gently and fades as section scrolls out
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      aria-label="Site hero"
    >
      <motion.div
        className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {children}
      </motion.div>
    </section>
  );
}
