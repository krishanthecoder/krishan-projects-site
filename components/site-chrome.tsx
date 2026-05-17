import type { ReactNode } from "react";

import { Navbar } from "@/components/navbar";
import { ScrollToTopButton } from "@/components/scroll-to-top";
import { SiteFooter } from "@/components/site-footer";

const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME ?? "Krishan Projects";
const serviceAreas = (process.env.NEXT_PUBLIC_BUSINESS_SERVICE_AREAS ?? "London, South Ockendon, Grays")
  .split(",")
  .map((area) => area.trim())
  .filter(Boolean);
const serviceAreasLabel = serviceAreas.join(", ");
const phoneNumber = process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "07572138829";

type SiteChromeProps = {
  children: ReactNode;
};

export function SiteChrome({ children }: SiteChromeProps) {
  return (
    <div className="flex min-h-screen flex-col bg-stone-white text-graphite">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-stone-white focus:px-3 focus:py-2 focus:text-graphite focus:shadow-md focus:outline-none focus:ring-2 focus:ring-gold"
      >
        Skip to main content
      </a>

      <Navbar businessName={businessName} phoneNumber={phoneNumber} />

      <div className="flex min-h-0 flex-1 flex-col">{children}</div>

      <ScrollToTopButton />

      <SiteFooter
        businessName={businessName}
        serviceAreasLabel={serviceAreasLabel}
        phoneNumber={phoneNumber}
      />
    </div>
  );
}
