/** Shared vertical sizing for full-width marketing heroes (Services, Contact map, etc.). */
export const pageHeroSectionClass =
  "relative w-full overflow-hidden bg-graphite py-16 sm:py-20";

/** Version 1 — homepage hero: 30px → 48px → 60px */
const HERO_HEADING_SCALE_V1 = "text-3xl sm:text-5xl lg:text-6xl";

/** Version 2 — other page heroes: 30px → 36px → 48px */
const HERO_HEADING_SCALE_V2 = "text-3xl sm:text-4xl lg:text-5xl";

/** Default hero scale for Services, Contact, Projects, and in-page section titles. */
export const heroHeadingScaleClass = HERO_HEADING_SCALE_V2;

export const heroHeadingClassGraphite = [
  "font-bold leading-tight tracking-tight text-graphite",
  heroHeadingScaleClass,
].join(" ");

/** Homepage hero only — larger scale (version 1). */
export const heroHeadingClassGraphiteHome = [
  "font-bold leading-tight tracking-tight text-graphite",
  HERO_HEADING_SCALE_V1,
].join(" ");

export const heroHeadingClassOnDark = [
  "font-bold leading-tight tracking-tight text-stone-white",
  heroHeadingScaleClass,
].join(" ");
