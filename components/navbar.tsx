"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";

type NavbarProps = {
  businessName: string;
  phoneNumber: string;
};

const navLinks = [
  { name: "Services", href: "/services" },
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
];
const mobileNavLinks = [{ name: "Home", href: "/" }, ...navLinks];

const menuPanel: Variants = {
  hidden: { clipPath: "circle(0px at calc(100% - 2rem) 2rem)", opacity: 0.95 },
  visible: {
    clipPath: "circle(150vmax at calc(100% - 2rem) 2rem)",
    opacity: 1,
    transition: { stiffness: 180, damping: 26, mass: 0.8 },
  },
  exit: {
    clipPath: "circle(0px at calc(100% - 2rem) 2rem)",
    opacity: 0.95,
    transition: { duration: 0.28 },
  },
};

const linkContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const linkItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22 } },
};

export function Navbar({ businessName, phoneNumber }: NavbarProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const scrollY = window.scrollY;
    const htmlElement = document.documentElement;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      const previousScrollBehavior = htmlElement.style.scrollBehavior;
      htmlElement.style.scrollBehavior = "auto";
      window.scrollTo(0, scrollY);
      requestAnimationFrame(() => {
        htmlElement.style.scrollBehavior = previousScrollBehavior;
      });
    };
  }, [isMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-40 border-b border-graphite/8 bg-stone-white/95 backdrop-blur-sm transition-shadow ${
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
            className="transition duration-200 hover:scale-105 hover:brightness-115 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
            aria-label={`${businessName} home`}
          >
            <Image
              src="/brand/navbar-logo-v3-tweaked.png"
              alt={businessName}
              width={1161}
              height={335}
              sizes="(max-width: 360px) 118px, (max-width: 640px) 140px, 170px"
              className="h-8 w-auto min-[360px]:h-9 sm:h-[42px]"
              priority
              unoptimized
            />
          </Link>
        </motion.div>

        <div className="hidden items-center gap-8 md:flex">
          <nav aria-label="Main navigation" className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-bold uppercase tracking-wider transition-colors ${
                    isActive
                      ? "text-gold"
                      : "text-graphite hover:text-gold"
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

      <button
        type="button"
        className={`fixed right-4 top-4 z-[100] inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border transition-transform duration-200 ease-out hover:scale-110 md:hidden ${
          isMenuOpen
            ? "border-stone-white/25 bg-slate-900/70"
            : "border-graphite/15 bg-stone-white/85"
        }`}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        <div className="relative h-4 w-5">
          <motion.span
            className={`absolute left-0 top-0 h-[2px] w-5 rounded ${
              isMenuOpen ? "bg-stone-white" : "bg-graphite"
            }`}
            animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.22 }}
          />
          <motion.span
            className={`absolute left-0 top-[6px] h-[2px] w-5 rounded ${
              isMenuOpen ? "bg-stone-white" : "bg-graphite"
            }`}
            animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.18 }}
          />
          <motion.span
            className={`absolute left-0 top-[12px] h-[2px] w-5 rounded ${
              isMenuOpen ? "bg-stone-white" : "bg-graphite"
            }`}
            animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.22 }}
          />
        </div>
      </button>

      <AnimatePresence>
        {isMenuOpen ? (
          <motion.nav
            aria-label="Mobile navigation"
            className="fixed inset-0 z-50 flex h-[100svh] flex-col justify-center bg-slate-900/90 p-6 backdrop-blur-xl md:hidden"
            variants={menuPanel}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.ul
              className="mx-auto w-full max-w-md space-y-5 text-center"
              variants={linkContainer}
              initial="hidden"
              animate="visible"
            >
              {mobileNavLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <motion.li key={link.href} variants={linkItem}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block rounded-xl px-4 py-3 text-4xl font-bold tracking-tight text-stone-white transition duration-200 ${
                        isActive
                            ? "text-gold"
                          : "hover:translate-x-1 hover:scale-[1.02] hover:underline hover:underline-offset-8"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ul>

            <a
              href={`tel:${phoneNumber.replace(/\s/g, "")}`}
              className="mx-auto mt-10 inline-flex w-full max-w-md items-center justify-center rounded-xl bg-gold px-4 py-3 text-sm font-bold text-stone-white shadow-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              {phoneNumber}
            </a>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
