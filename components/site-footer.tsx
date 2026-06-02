import Link from "next/link";
import { Phone } from "lucide-react";

import { BrandLockup } from "@/components/brand/brand-lockup";
import { formatUkPhoneDisplay, phoneTelHref } from "@/lib/format-phone";

const footerNavLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
] as const;

type SiteFooterProps = {
  businessName: string;
  serviceAreasLabel: string;
  phoneNumber: string;
};

export function SiteFooter({
  businessName,
  serviceAreasLabel,
  phoneNumber,
}: SiteFooterProps) {
  const telHref = phoneTelHref(phoneNumber);
  const phoneDisplay = formatUkPhoneDisplay(phoneNumber);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gold/25 bg-graphite text-stone-white">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr_1fr] lg:gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="w-fit transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-graphite"
              aria-label={`${businessName} home`}
            >
              <BrandLockup compact variant="inverted" alt={businessName} />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-stone-white/75">
              Serving {serviceAreasLabel}
            </p>
          </div>

          {/* Explore */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Explore
            </p>
            <nav className="mt-4" aria-label="Footer">
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                {footerNavLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-block text-sm font-semibold text-stone-white/85 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-graphite"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact card */}
          <div className="rounded-2xl border border-stone-white/10 bg-stone-white/5 p-5 backdrop-blur-sm sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Get in touch
            </p>
            <div className="mt-4 flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15">
                <Phone className="h-5 w-5 text-gold" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-stone-white/60">Prefer to talk?</p>
                <a
                  href={telHref}
                  className="mt-0.5 block text-lg font-bold tracking-tight text-stone-white transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-graphite"
                >
                  {phoneDisplay}
                </a>
                <p className="mt-1 text-xs text-stone-white/55">
                  Covering {serviceAreasLabel}
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <a
                href={telHref}
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-gold px-4 py-2.5 text-sm font-bold text-stone-white shadow-sm transition hover:bg-gold/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-graphite"
              >
                Call now
              </a>
              <Link
                href="/contact"
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-stone-white/25 bg-transparent px-4 py-2.5 text-sm font-semibold text-stone-white transition hover:border-stone-white/40 hover:bg-stone-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-graphite"
              >
                Request a quote
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-stone-white/10 pt-6">
          <p className="text-xs text-stone-white/55">
            &copy; {year} {businessName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
