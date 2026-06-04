import { ServicesHeroGridPattern } from "@/components/services/services-hero-content";
import { CONTACT_MAP_HERO_IMAGE_SRC } from "@/lib/contact-map-hero";
import { pageHeroSectionClass } from "@/lib/page-hero";

import { ContactHeroCopy } from "./contact-hero-copy";

/** Full-width contact hero with optional static map image background (non-interactive). */
export function ContactHero() {
  return (
    <section className={pageHeroSectionClass} aria-labelledby="contact-map-heading">
      <div
        aria-hidden
        className="absolute inset-0 z-0 bg-graphite bg-cover bg-center"
        style={{ backgroundImage: `url(${CONTACT_MAP_HERO_IMAGE_SRC})` }}
      />

      <ServicesHeroGridPattern />

      <div className="pointer-events-none absolute inset-0 z-[1] bg-graphite/55" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
        <ContactHeroCopy />
      </div>
    </section>
  );
}
