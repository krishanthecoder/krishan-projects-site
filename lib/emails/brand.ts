import { brandLockupDimensions, brandLogos } from "@/lib/brand-assets";

/** Email-safe brand palette — mirrors `app/globals.css`. */
export const emailBrand = {
  stoneWhite: "#F9F9F8",
  parchment: "#EDEBE5",
  graphite: "#333333",
  warmMist: "#8C8780",
  gold: "#C4973D",
} as const;

/** Matches navbar lockup (`h-10` / `sm:h-11` in `BrandLockup`). */
export const emailLogoDimensions = {
  height: 42,
  width: Math.round(42 * (brandLockupDimensions.width / brandLockupDimensions.height)),
} as const;

export function getEmailWebsiteUrl(): string {
  return (process.env.NEXT_PUBLIC_WEBSITE_URL ?? "https://krishanprojects.co.uk").replace(
    /\/$/,
    "",
  );
}

export function getEmailBusinessName(): string {
  return process.env.NEXT_PUBLIC_BUSINESS_NAME ?? "Krishan Projects";
}

export function getEmailLogoUrl(variant: "default" | "inverted" = "default"): string {
  const base = getEmailWebsiteUrl();
  const path = variant === "inverted" ? brandLogos.inverted.png : brandLogos.default.png;
  return `${base}${path}`;
}
