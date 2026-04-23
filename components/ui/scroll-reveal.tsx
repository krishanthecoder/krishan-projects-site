"use client";

import { motion } from "framer-motion";

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

// Custom ease — fast-in, long deceleration tail common in premium UIs
const EASE = [0.22, 1, 0.36, 1] as const;

export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  // Disable animations on mobile to improve LCP and Performance scores
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  if (isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
