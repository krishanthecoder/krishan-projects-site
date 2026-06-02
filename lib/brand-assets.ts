/**
 * Single source of truth for Krishan Projects brand imagery on the marketing site.
 *
 * - Navbar: `default` lockup (dark text on light header)
 * - Footer: `inverted` lockup (light text on dark footer)
 * - Favicon / app icon: `emblem` (symbol cropped from the lockup)
 *
 * SVG lockups embed the matching PNG for a pixel-perfect match until we have
 * original vector design files.
 */

export type BrandLogoVariant = "default" | "inverted";

export type BrandLogoSources = {
  svg: string;
  png: string;
  /** Short note for alt text / docs */
  usage: string;
};

export const brandLogos = {
  default: {
    svg: "/brand/navbar-logo-v3-tweaked.svg",
    png: "/brand/navbar-logo-v3-tweaked.png",
    usage: "Navbar and other light backgrounds",
  },
  inverted: {
    svg: "/brand/navbar-logo-v3-inverted.svg",
    png: "/brand/navbar-logo-v3-inverted.png",
    usage: "Footer and other dark backgrounds",
  },
} as const satisfies Record<BrandLogoVariant, BrandLogoSources>;

/** Navbar lockup — alias for clarity at call sites */
export const brandLogoNavbar = brandLogos.default;

/** Footer lockup — inverted colours for dark footer */
export const brandLogoFooter = brandLogos.inverted;

export const brandEmblem = {
  png: "/icon.png",
  usage: "Browser tab favicon (symbol from the lockup)",
} as const;

export const brandLockupDimensions = {
  width: 1161,
  height: 335,
} as const;

export function getBrandLogoSources(variant: BrandLogoVariant): BrandLogoSources {
  return brandLogos[variant];
}
