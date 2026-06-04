"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "framer-motion";

import {
  PAGE_REVEAL_DURATION,
  PAGE_REVEAL_EASE,
  PAGE_REVEAL_OFFSET_Y,
  PAGE_REVEAL_STAGGER,
  PAGE_REVEAL_VIEWPORT,
} from "@/lib/page-motion";

type ScrollRevealContextValue = {
  consumeDelay: () => number;
  when: "inView" | "mount";
};

const ScrollRevealContext = createContext<ScrollRevealContextValue | null>(null);

type ScrollRevealGroupProps = {
  children: ReactNode;
  className?: string;
  /** Seconds between sibling reveals (default from `page-motion`). */
  stagger?: number;
  /** `mount` for above-the-fold heroes; default scroll-into-view. */
  when?: "inView" | "mount";
};

/** Groups sibling `ScrollReveal` blocks with automatic staggered delays. Nest for sub-sections (e.g. hero lines). */
export function ScrollRevealGroup({
  children,
  className,
  stagger = PAGE_REVEAL_STAGGER,
  when = "inView",
}: ScrollRevealGroupProps) {
  const indexRef = useRef(0);

  const consumeDelay = useCallback(() => {
    const delay = indexRef.current * stagger;
    indexRef.current += 1;
    return delay;
  }, [stagger]);

  return (
    <ScrollRevealContext.Provider value={{ consumeDelay, when }}>
      {className ? <div className={className}>{children}</div> : children}
    </ScrollRevealContext.Provider>
  );
}

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /** Override auto-stagger from parent `ScrollRevealGroup`. */
  delay?: number;
  /** `mount` animates on page load (heroes); default uses scroll into view. */
  when?: "inView" | "mount";
};

/** Fade-up when entering the viewport. Uses parent group stagger unless `delay` is set. */
export function ScrollReveal({ children, className, delay, when: whenProp }: ScrollRevealProps) {
  const group = useContext(ScrollRevealContext);
  const reduceMotion = useReducedMotion();
  const resolvedDelayRef = useRef<number | null>(null);

  if (resolvedDelayRef.current === null) {
    resolvedDelayRef.current =
      delay ?? (group ? group.consumeDelay() : 0);
  }

  const resolvedDelay = resolvedDelayRef.current;
  const when = whenProp ?? group?.when ?? "inView";

  if (reduceMotion) {
    return className ? <div className={className}>{children}</div> : children;
  }

  const motionProps =
    when === "mount"
      ? {
          initial: { opacity: 0, y: PAGE_REVEAL_OFFSET_Y },
          animate: { opacity: 1, y: 0 },
        }
      : {
          initial: { opacity: 0, y: PAGE_REVEAL_OFFSET_Y },
          whileInView: { opacity: 1, y: 0 },
          viewport: PAGE_REVEAL_VIEWPORT,
        };

  return (
    <motion.div
      className={className}
      {...motionProps}
      transition={{
        duration: PAGE_REVEAL_DURATION,
        ease: PAGE_REVEAL_EASE,
        delay: resolvedDelay,
      }}
    >
      {children}
    </motion.div>
  );
}

/** Alias — same component, clearer name for top-level page sections. */
export const ScrollRevealSection = ScrollReveal;
