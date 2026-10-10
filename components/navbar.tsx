"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState, type MouseEvent } from "react";

import { BrandLockup } from "@/components/brand/brand-lockup";
import { CLOSE_MOBILE_NAV_EVENT } from "@/components/mobile-nav";
import { siteLayerClass } from "@/lib/site-layers";
import { isNavLinkActive, navLinks } from "@/lib/site-nav";

type NavbarProps = {
  businessName: string;
  phoneNumber: string;
};

export function Navbar({ businessName, phoneNumber }: NavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    window.dispatchEvent(new Event(CLOSE_MOBILE_NAV_EVENT));
    if (pathname !== "/") return;

    event.preventDefault();

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, left: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  return (
    <header
      className={`sticky top-0 ${siteLayerClass.header} border-b border-graphite/8 bg-stone-white/95 backdrop-blur-sm transition-shadow ${
        isScrolled ? "shadow-[0_8px_24px_-16px_rgba(0,0,0,0.35)]" : ""
      }`}
    >
      <div className="mx-auto flex min-h-20 max-w-6xl items-center justify-between gap-4 px-6 py-3 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24 }}
        >
          <Link
            href="/"
            onClick={handleLogoClick}
            className="transition duration-200 hover:scale-105 hover:brightness-115 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
            aria-label={`${businessName} home`}
          >
            <BrandLockup compact alt={businessName} />
          </Link>
        </motion.div>

        <div className="hidden items-center gap-8 md:flex">
          <nav aria-label="Main navigation" className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = isNavLinkActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-bold uppercase tracking-wider transition-colors ${
                    isActive ? "text-gold" : "text-graphite hover:text-gold"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
          <motion.a
            href={`tel:${phoneNumber.replace(/\s/g, "")}`}
            className="shrink-0 rounded-xl bg-gold px-4 py-2 text-sm font-bold text-stone-white shadow-sm transition-all hover:bg-gold/90 active:scale-95 active:bg-gold/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label={`Call us at ${phoneNumber}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, delay: 0.08 }}
          >
            {phoneNumber}
          </motion.a>
        </div>
      </div>
    </header>
  );
}
