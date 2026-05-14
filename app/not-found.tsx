import { HardHat, Hammer, Ruler } from "lucide-react";
import Link from "next/link";

import { SiteChrome } from "@/components/site-chrome";

/** 404 — tradesman “site notice”: headline stack (notice, tools, 404) on top, copy and actions below. */
export default function NotFound() {
  return (
    <SiteChrome>
      <main
        id="main-content"
        className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-parchment text-graphite"
      >
        {/* Blueprint grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage: `
              linear-gradient(rgba(51, 51, 51, 0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(51, 51, 51, 0.06) 1px, transparent 1px)
            `,
            backgroundSize: "26px 26px",
          }}
          aria-hidden
        />

        {/* Hazard band — top */}
        <div
          className="relative z-[1] h-2.5 w-full shrink-0 shadow-sm sm:h-3"
          style={{
            background:
              "repeating-linear-gradient(-45deg, #333333 0px, #333333 11px, #C4973D 11px, #C4973D 22px)",
          }}
          aria-hidden
        />

        <div className="relative z-[1] flex flex-1 flex-col items-center justify-center px-5 py-14 sm:px-10 sm:py-16 md:px-12 md:py-20 lg:px-16">
          <div className="mx-auto w-full max-w-5xl">
            <div className="relative border-4 border-graphite bg-stone-white px-8 py-12 shadow-[8px_8px_0_0_rgba(196,151,61,0.35)] sm:px-12 sm:py-14 lg:px-16 lg:py-16 xl:px-20 xl:py-24">
              {/* Corner “rivets” */}
              <span
                className="absolute left-4 top-4 size-2 rounded-full bg-graphite/25 ring-1 ring-graphite/20 sm:left-5 sm:top-5"
                aria-hidden
              />
              <span
                className="absolute right-4 top-4 size-2 rounded-full bg-graphite/25 ring-1 ring-graphite/20 sm:right-5 sm:top-5"
                aria-hidden
              />
              <span
                className="absolute bottom-4 left-4 size-2 rounded-full bg-graphite/25 ring-1 ring-graphite/20 sm:bottom-5 sm:left-5"
                aria-hidden
              />
              <span
                className="absolute bottom-4 right-4 size-2 rounded-full bg-graphite/25 ring-1 ring-graphite/20 sm:bottom-5 sm:right-5"
                aria-hidden
              />

              <div className="flex flex-col items-stretch gap-16 sm:gap-20">
                {/* Top stack: stamp, tools, 404 */}
                <div className="flex flex-col items-center border-b border-graphite/10 pb-12 text-center sm:pb-14">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-warm-mist sm:text-[11px]">
                    Site notice — wrong plot
                  </p>

                  <div
                    className="mt-8 flex items-center justify-center gap-4 text-gold sm:mt-10 sm:gap-5"
                    aria-hidden
                  >
                    <HardHat className="size-8 shrink-0 sm:size-9" strokeWidth={1.35} />
                    <Hammer className="size-7 shrink-0 sm:size-8" strokeWidth={1.35} />
                    <Ruler className="size-8 shrink-0 sm:size-9" strokeWidth={1.35} />
                  </div>

                  <h1 className="mt-8 text-[clamp(5rem,32vw,12rem)] font-black leading-[0.88] tracking-[-0.02em] text-graphite sm:mt-10">
                    <span className="text-gold">404</span>
                    <span className="sr-only"> — Page not found</span>
                  </h1>
                </div>

                {/* Body: copy + actions */}
                <div className="flex flex-col items-center text-center">
                  <p className="max-w-xl text-pretty font-mono text-[11px] font-medium uppercase leading-loose tracking-[0.12em] text-graphite/85 sm:text-xs">
                    Nothing built at this address — the page may have moved, been pulled down, or
                    never went up in the first place.
                  </p>

                  <p className="mt-8 max-w-md text-sm leading-loose text-warm-mist sm:mt-10">
                    Head back to the home page, or open Contact if you were following a link from an
                    old flyer or message.
                  </p>

                  <div className="mt-10 flex w-full max-w-md flex-col gap-4 sm:mt-12 sm:flex-row sm:justify-center">
                    <Link
                      href="/"
                      className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-xl bg-gold px-8 py-3.5 text-center text-sm font-bold text-stone-white shadow-sm transition hover:bg-gold/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-stone-white sm:flex-none sm:min-w-[11rem]"
                    >
                      Back to home
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-xl border-2 border-graphite/20 bg-transparent px-8 py-3.5 text-center text-sm font-bold text-graphite transition hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-stone-white sm:flex-none sm:min-w-[11rem]"
                    >
                      Contact
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hazard band — bottom */}
        <div
          className="relative z-[1] h-2.5 w-full shrink-0 shadow-[0_-2px_6px_rgba(0,0,0,0.06)] sm:h-3"
          style={{
            background:
              "repeating-linear-gradient(45deg, #333333 0px, #333333 11px, #C4973D 11px, #C4973D 22px)",
          }}
          aria-hidden
        />
      </main>
    </SiteChrome>
  );
}
