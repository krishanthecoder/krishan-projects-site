"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { siteLayerClass } from "@/lib/site-layers";
import { isNavLinkActive, mobileNavLinks } from "@/lib/site-nav";

export const CLOSE_MOBILE_NAV_EVENT = "kp-close-mobile-nav";

const MOBILE_NAV_ROOT_ID = "mobile-nav-root";

type MobileNavProps = {
  phoneNumber: string;
};

const menuPanel: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeIn" } },
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

const mobileNavLinkClass = (isActive: boolean) =>
  [
    "block rounded-xl px-4 py-3 text-4xl font-bold tracking-tight transition duration-200",
    "hover:translate-x-1 hover:scale-[1.06] hover:underline hover:underline-offset-8",
    isActive ? "text-gold" : "text-stone-white",
  ].join(" ");

export function MobileNav({ phoneNumber }: MobileNavProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [host, setHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const root = document.createElement("div");
    root.id = MOBILE_NAV_ROOT_ID;
    document.body.appendChild(root);
    setHost(root);
    return () => {
      root.remove();
      setHost(null);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    const onClose = () => setIsMenuOpen(false);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(CLOSE_MOBILE_NAV_EVENT, onClose);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(CLOSE_MOBILE_NAV_EVENT, onClose);
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const scrollY = window.scrollY;
    const htmlElement = document.documentElement;
    const previousScrollBehavior = htmlElement.style.scrollBehavior;
    htmlElement.style.scrollBehavior = "auto";
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
      window.scrollTo(0, scrollY);
      htmlElement.style.scrollBehavior = previousScrollBehavior;
    };
  }, [isMenuOpen]);

  const menu = (
    <>
      <button
        type="button"
        className={`fixed right-4 top-4 ${siteLayerClass.mobileMenuButton} inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border transition-colors duration-200 md:hidden ${
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
            className={`absolute left-0 top-0 h-[2px] w-5 rounded transition-colors duration-200 ${
              isMenuOpen ? "bg-stone-white" : "bg-graphite"
            }`}
            animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.22 }}
          />
          <motion.span
            className={`absolute left-0 top-[6px] h-[2px] w-5 rounded transition-colors duration-200 ${
              isMenuOpen ? "bg-stone-white" : "bg-graphite"
            }`}
            animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.18 }}
          />
          <motion.span
            className={`absolute left-0 top-[12px] h-[2px] w-5 rounded transition-colors duration-200 ${
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
            className={`fixed inset-0 ${siteLayerClass.mobileMenu} flex flex-col justify-center bg-slate-900/95 p-6 md:hidden`}
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
                const isActive = isNavLinkActive(pathname, link.href);
                return (
                  <motion.li key={link.href} variants={linkItem}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={mobileNavLinkClass(isActive)}
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
    </>
  );

  if (!host) return menu;
  return createPortal(menu, host);
}
