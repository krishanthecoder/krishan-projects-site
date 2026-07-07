"use client";

import { ServicesHeroGridPattern } from "@/components/services/services-hero-grid-pattern";
import { ScrollReveal, ScrollRevealGroup } from "@/components/ui/scroll-reveal";
import { heroHeadingClassOnDark, pageHeroMarketingSectionClass } from "@/lib/page-hero";

export function LeaveReviewHero() {
  return (
    <section className={pageHeroMarketingSectionClass} aria-labelledby="leave-review-heading">
      <ServicesHeroGridPattern />
      <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
        <ScrollRevealGroup
          when="mount"
          className="relative z-[1] grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start"
        >
          <ScrollReveal>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                Customer reviews
              </p>
              <h1 id="leave-review-heading" className={`mt-4 ${heroHeadingClassOnDark}`}>
                Tell us how we did.
                <span className="block text-gold">We value honest feedback.</span>
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-stone-white/80 sm:text-base">
                Honest feedback helps other homeowners choose a builder they can trust — and helps
                us keep improving on every job.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal className="lg:mt-9">
            <div className="rounded-2xl border border-stone-white/10 bg-stone-white/5 p-5 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-white/55">
                Before you submit
              </p>
              <p className="mt-2 text-sm leading-relaxed text-stone-white/85">
                A few sentences about the job, the team, and the finish is plenty. We read every
                submission and only publish reviews we&apos;re happy to stand behind.
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                Moderated before going live
              </p>
            </div>
          </ScrollReveal>
        </ScrollRevealGroup>
      </div>
    </section>
  );
}
