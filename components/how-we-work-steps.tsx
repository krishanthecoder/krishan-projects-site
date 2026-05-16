"use client";

import {
  motion,
  useAnimationControls,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef } from "react";

type Step = {
  title: string;
  body: string;
};

type HowWeWorkStepsProps = {
  steps: Step[];
};

const sequenceStart = 0.22;
/** Time for a step number to transition to gold */
const numberColorDuration = 0.4;
/** Pause after the number turns gold before travel begins */
const pauseBeforeTravel = 0.06;
/** Glow travels down the connector toward the arrow */
const travelDuration = 0.26;

const segmentCycle =
  numberColorDuration + pauseBeforeTravel + travelDuration;

const goldBg = "rgba(196,151,61,1)";
const goldBgHold = "rgba(196,151,61,0.95)";
const graphiteBg = "rgba(51,51,51,1)";
const arrowDim = "rgba(51,51,51,0.25)";
const arrowGold = "rgba(196,151,61,0.96)";

export function HowWeWorkSteps({ steps }: HowWeWorkStepsProps) {
  /** Gate animation until this block is well inside the viewport (not a sliver at the edge). */
  const viewportAnchorRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(viewportAnchorRef, {
    once: true,
    /* Require ~half the steps list visible — avoids starting while still “below the fold edge”. */
    amount: 0.45,
    /* Shrink the observer root inward so the user must scroll the section into view comfortably. */
    margin: "-72px 0px -100px 0px",
  });
  const controls = useAnimationControls();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    controls.start(reduceMotion ? "instant" : "sequence");
  }, [controls, isInView, reduceMotion]);

  return (
    <div ref={viewportAnchorRef}>
      <ol className="mt-8 space-y-6">
      {steps.map((step, index) => (
        <li key={step.title} className="flex gap-4">
          <div className="flex flex-col items-center self-stretch">
            <motion.span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-graphite text-xs font-bold text-stone-white"
              initial="idle"
              animate={controls}
              variants={{
                idle: {
                  backgroundColor: graphiteBg,
                },
                instant: {
                  backgroundColor: goldBgHold,
                  transition: { duration: 0 },
                },
                sequence: {
                  backgroundColor: [graphiteBg, goldBg, goldBgHold],
                  transition: {
                    duration: numberColorDuration,
                    delay: sequenceStart + index * segmentCycle,
                    ease: "easeOut",
                    times: [0, 0.55, 1],
                  },
                },
              }}
            >
              {index + 1}
            </motion.span>
            {index < steps.length - 1 ? (
              <div
                aria-hidden="true"
                className="mt-1 flex min-h-[1.5rem] w-[3px] flex-1 flex-col items-stretch"
              >
                <div className="relative flex min-h-[1rem] flex-1 flex-col">
                  {/* Dim track only behind the vertical stem */}
                  <span className="pointer-events-none absolute inset-0 rounded-full bg-graphite/15" />
                  {/* Gold fill travels top → bottom toward the arrow */}
                  <motion.span
                    className="relative z-[1] w-full flex-1 origin-top rounded-full bg-[rgba(196,151,61,0.96)]"
                    initial="idle"
                    animate={controls}
                    variants={{
                      idle: {
                        scaleY: 0,
                      },
                      instant: {
                        scaleY: 1,
                        transition: { duration: 0 },
                      },
                      sequence: {
                        scaleY: [0, 1],
                        transition: {
                          duration: travelDuration,
                          delay:
                            sequenceStart +
                            index * segmentCycle +
                            numberColorDuration +
                            pauseBeforeTravel,
                          /* Snappy: most of the motion early, sharp settle */
                          ease: [0.14, 0.95, 0.28, 1],
                        },
                      },
                    }}
                  />
                </div>
                <motion.span
                  className="relative z-[2] mt-0.5 h-0 w-0 shrink-0 self-center border-l-[5px] border-r-[5px] border-t-[8px] border-l-transparent border-r-transparent border-t-graphite/20"
                  initial="idle"
                  animate={controls}
                  variants={{
                    idle: {
                      opacity: 0.65,
                      borderTopColor: arrowDim,
                    },
                    instant: {
                      opacity: 1,
                      borderTopColor: arrowGold,
                      transition: { duration: 0 },
                    },
                    sequence: {
                      opacity: [0.65, 1, 1],
                      borderTopColor: [arrowDim, arrowGold, arrowGold],
                      transition: {
                        duration: 0.18,
                        delay:
                          sequenceStart +
                          (index + 1) * segmentCycle,
                        ease: [0.14, 0.95, 0.28, 1],
                        times: [0, 0.42, 1],
                      },
                    },
                  }}
                />
              </div>
            ) : null}
          </div>
          <div className="pb-1">
            <p className="text-sm font-bold text-graphite">{step.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-graphite/85">
              {step.body}
            </p>
          </div>
        </li>
      ))}
      </ol>
    </div>
  );
}
