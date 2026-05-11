import Link from "next/link";

import { BrandLockup } from "@/components/brand/brand-lockup";
import { Navbar } from "@/components/navbar";
import { ScrollToTopButton } from "@/components/scroll-to-top";

const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME ?? "Krishan Projects";
const serviceAreas = (process.env.NEXT_PUBLIC_BUSINESS_SERVICE_AREAS ?? "London, South Ockendon, Grays")
  .split(",")
  .map((area) => area.trim())
  .filter(Boolean);
const serviceAreasLabel = serviceAreas.join(", ");
const phoneNumber = process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "07572138829";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-col bg-stone-white text-graphite">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-stone-white focus:px-3 focus:py-2 focus:text-graphite focus:shadow-md focus:outline-none focus:ring-2 focus:ring-gold"
      >
        Skip to main content
      </a>

      <Navbar businessName={businessName} phoneNumber={phoneNumber} />

      {children}

      <ScrollToTopButton />

      <footer className="border-t border-gold/25 bg-graphite py-12 text-stone-white">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-graphite"
                aria-label={`${businessName} home`}
              >
                <BrandLockup compact variant="inverted" />
              </Link>
              <p className="text-sm text-stone-white/75">Serving {serviceAreasLabel}</p>
            </div>
            <a
              href={`tel:${phoneNumber.replace(/\s/g, "")}`}
              className="text-sm font-semibold text-gold transition-colors hover:text-gold/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-graphite"
            >
              {phoneNumber}
            </a>
          </div>
          <p className="mt-6 text-xs text-stone-white/55">
            &copy; {new Date().getFullYear()} {businessName}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
