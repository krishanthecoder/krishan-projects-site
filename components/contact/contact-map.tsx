import { ServicesHeroGridPattern } from "@/components/services/services-hero-content";
import {
  CONTACT_MAP_HERO_IMAGE_HEIGHT,
  CONTACT_MAP_HERO_IMAGE_SRC,
  CONTACT_MAP_HERO_IMAGE_WIDTH,
} from "@/lib/contact-map-hero";
import { pageHeroSectionClass } from "@/lib/page-hero";

const CONTACT_HERO_COPY = {
  eyebrow: "Get in Touch",
  title: "Start Your Project",
  description:
    "Ready to discuss your home renovation? Message us today for a free site visit and quote.",
} as const;

/** Full-width contact hero with a static map image background (non-interactive). */
export function ContactMapHero() {
  return (
    <section
      className={`${pageHeroSectionClass} left-1/2 w-screen max-w-[100vw] -translate-x-1/2`}
      aria-labelledby="contact-map-heading"
    >
      <img
        src={CONTACT_MAP_HERO_IMAGE_SRC}
        alt=""
        width={CONTACT_MAP_HERO_IMAGE_WIDTH}
        height={CONTACT_MAP_HERO_IMAGE_HEIGHT}
        className="absolute inset-0 z-0 h-full w-full object-cover object-center"
        loading="lazy"
        decoding="async"
        draggable={false}
        aria-hidden
      />

      <ServicesHeroGridPattern />

      <div className="pointer-events-none absolute inset-0 z-[1] bg-graphite/55" aria-hidden />

      <div className="relative z-[2] mx-auto max-w-6xl px-6 sm:px-10">
        <div className="max-w-2xl">
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
      </div>
    </section>
  );
}
