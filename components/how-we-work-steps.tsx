"use client";

import { motion, useAnimationControls, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

type Step = {
  title: string;
  body: string;
};

type HowWeWorkStepsProps = {
  steps: Step[];
};

export function HowWeWorkSteps({ steps }: HowWeWorkStepsProps) {
  const listRef = useRef<HTMLOListElement | null>(null);
  const isInView = useInView(listRef, { once: true, amount: 0.25 });
  const controls = useAnimationControls();
  const lineDuration = 1.9;
  const stepDelay = 0.9;
  const sequenceStart = 0.3;

  useEffect(() => {
    if (!isInView) return;
    controls.start("glow");
  }, [controls, isInView]);

  return (
    <ol ref={listRef} className="mt-8 space-y-6">
      {steps.map((step, index) => (
        <li key={step.title} className="flex gap-4">
          <div className="flex flex-col items-center">
            <motion.span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-graphite text-xs font-bold text-stone-white"
              initial="idle"
              animate={controls}
              variants={{
                idle: {
                  backgroundColor: "rgba(51,51,51,1)",
                  boxShadow: "0 0 0 rgba(196,151,61,0)",
                },
                glow: {
                  backgroundColor: [
                    "rgba(51,51,51,1)",
                    "rgba(196,151,61,1)",
                    "rgba(196,151,61,0.95)",
                  ],
                  boxShadow: [
                    "0 0 0 rgba(196,151,61,0)",
                    "0 0 12px rgba(196,151,61,0.75)",
                    "0 0 0 rgba(196,151,61,0)",
                  ],
                },
              }}
              transition={{
                duration: 0.8,
                delay:
                  index === 0
                    ? sequenceStart * 0.7
                    : sequenceStart + (index - 1) * stepDelay + lineDuration * 0.72,
                ease: "easeInOut",
              }}
            >
              {index + 1}
            </motion.span>
            {index < steps.length - 1 ? (
              <div aria-hidden="true" className="mt-1 flex flex-1 flex-col items-center">
                <motion.span
                  className="w-[3px] flex-1 rounded-full bg-graphite/15"
                  initial="idle"
                  animate={controls}
                  variants={{
                    idle: {
                      opacity: 0.55,
                      backgroundColor: "rgba(51,51,51,0.22)",
                      boxShadow: "0 0 0 rgba(196,151,61,0)",
                    },
                    glow: {
                      opacity: [0.55, 1, 0.72],
                      backgroundColor: [
                        "rgba(51,51,51,0.22)",
                        "rgba(196,151,61,0.98)",
                        "rgba(51,51,51,0.25)",
                      ],
                      boxShadow: [
                        "0 0 0 rgba(196,151,61,0)",
                        "0 0 14px rgba(196,151,61,0.85)",
                        "0 0 0 rgba(196,151,61,0)",
                      ],
                    },
                  }}
                  transition={{
                    duration: lineDuration,
                    delay: sequenceStart + index * stepDelay,
                    ease: "easeInOut",
                  }}
                />
                <motion.span
                  className="h-0 w-0 border-l-[5px] border-r-[5px] border-t-[8px] border-l-transparent border-r-transparent border-t-graphite/20"
                  initial="idle"
                  animate={controls}
                  variants={{
                    idle: {
                      opacity: 0.7,
                      borderTopColor: "rgba(51,51,51,0.25)",
                      filter: "drop-shadow(0 0 0 rgba(196,151,61,0))",
                    },
                    glow: {
                      opacity: [0.7, 1, 0.78],
                      borderTopColor: [
                        "rgba(51,51,51,0.25)",
                        "rgba(196,151,61,0.98)",
                        "rgba(51,51,51,0.28)",
                      ],
                      filter: [
                        "drop-shadow(0 0 0 rgba(196,151,61,0))",
                        "drop-shadow(0 0 8px rgba(196,151,61,0.8))",
                        "drop-shadow(0 0 0 rgba(196,151,61,0))",
                      ],
                    },
                  }}
                  transition={{
                    duration: lineDuration,
                    delay: sequenceStart + index * stepDelay,
                    ease: "easeInOut",
                  }}
                />
              </div>
            ) : null}
          </div>
          <div className="pb-1">
            <p className="text-sm font-bold text-graphite">{step.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-graphite/85">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
