"use client";

import { ScrollReveal, ScrollRevealGroup } from "@/components/ui/scroll-reveal";

import type { ServicesHeroProps } from "./services-hero-types";

export function ServicesHeroCopy({
  primaryArea,
  serviceAreasLabel,
}: ServicesHeroProps) {
  return (
    <ScrollRevealGroup when="mount" className="relative z-[1] grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
      <ScrollReveal>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            What we do
          </p>
          <h1
            id="services-hero-heading"
            className="mt-4 text-3xl font-bold leading-tight tracking-tight text-stone-white sm:text-4xl lg:text-5xl"
          >
            Every trade you need.
            <span className="block text-gold">One team on site.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-stone-white/80 sm:text-base">
            From decoration to drainage, we handle the trades homeowners in {primaryArea}{" "}
            need for renovations, extensions, and repairs — with the same tidy sites and clear
            communication you see on our project pages.
          </p>
        </div>
      </ScrollReveal>
      <ScrollReveal>
        <div className="rounded-2xl border border-stone-white/10 bg-stone-white/5 p-5 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-white/55">
            On most jobs
          </p>
          <p className="mt-2 text-sm leading-relaxed text-stone-white/85">
            Kitchens, bathrooms, and extensions pull several trades together. You get one
            programme and crews who already work together — not a string of separate
            subcontractors to chase.
          </p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-gold">
            Covering {serviceAreasLabel}
          </p>
        </div>
      </ScrollReveal>
    </ScrollRevealGroup>
  );
}
