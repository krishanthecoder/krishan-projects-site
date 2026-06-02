import { pageHeroSectionClass } from "@/lib/page-hero";

import { ServicesHeroCopy, ServicesHeroGridPattern } from "./services-hero-content";
import type { ServicesHeroProps } from "./services-hero-types";

export type { ServicesHeroProps } from "./services-hero-types";

/** Full-width services page hero. */
export function ServicesHero(props: ServicesHeroProps) {
  return (
    <section className={pageHeroSectionClass} aria-labelledby="services-hero-heading">
      <ServicesHeroGridPattern />
      <div className="relative mx-auto max-w-6xl px-6 sm:px-10">
        <ServicesHeroCopy {...props} />
      </div>
    </section>
  );
}
