/**
 * Fixed stacking order for the public site.
 * Fullscreen viewers sit above the phone menu so page work cannot cover the menu button
 * or leave the menu sitting on top of a player.
 */
export const siteLayerClass = {
  header: "z-40",
  scrollTop: "z-[80]",
  mobileMenu: "z-[90]",
  mobileMenuButton: "z-[100]",
  viewer: "z-[120]",
} as const;
