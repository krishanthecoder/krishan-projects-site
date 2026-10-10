export const navLinks = [
  { name: "Services", href: "/services" },
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
];

export const mobileNavLinks = [{ name: "Home", href: "/" }, ...navLinks];

/** Home is exact-match only; other items stay active on nested routes (e.g. /projects/[slug]). */
export function isNavLinkActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
