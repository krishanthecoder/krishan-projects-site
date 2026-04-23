"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Services", href: "/services" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-8">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-bold uppercase tracking-wider transition-colors ${
              isActive
                ? "text-gold underline underline-offset-8 decoration-2"
                : "text-graphite hover:text-gold"
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
