import { ServicesHeroGridPattern } from "@/components/services/services-hero-content";
import { pageHeroSectionClass } from "@/lib/page-hero";

import { ContactHeroCopy } from "./contact-hero-copy";
import { ContactHeroMap } from "./contact-hero-map";

/** Full-width contact hero with live service-area map. */
export function ContactHero() {
  return (
    <section className={pageHeroSectionClass} aria-labelledby="contact-map-heading">
      <ContactHeroMap />

      <ServicesHeroGridPattern />

      <div
        className="contact-hero-map-overlay pointer-events-none absolute inset-0 z-[1]"
        aria-hidden
      />

      <div className="pointer-events-none relative z-[2] mx-auto max-w-6xl px-6 sm:px-10">
        <ContactHeroCopy />
      </div>
    </section>
  );
}
