"use client";

import { ScrollReveal, ScrollRevealGroup } from "@/components/ui/scroll-reveal";

const CONTACT_HERO_COPY = {
  eyebrow: "Get in Touch",
  title: "Start Your Project",
  description:
    "Ready to discuss your home renovation? Message us today for a free site visit and quote.",
} as const;

export function ContactHeroCopy() {
  return (
    <ScrollRevealGroup when="mount" className="relative z-[1] max-w-2xl">
      <ScrollReveal>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            {CONTACT_HERO_COPY.eyebrow}
          </p>
          <h1
            id="contact-map-heading"
            className="mt-4 text-3xl font-bold leading-tight tracking-tight text-stone-white sm:text-4xl lg:text-5xl"
          >
            {CONTACT_HERO_COPY.title}
          </h1>
          <p className="mt-4 mb-14 text-sm leading-relaxed text-stone-white/80 sm:mb-16 sm:text-base lg:mb-20">
            {CONTACT_HERO_COPY.description}
          </p>
        </div>
      </ScrollReveal>
    </ScrollRevealGroup>
  );
}
