import type { Metadata } from "next";

import { ServicesHero } from "@/components/services/services-hero";
import { ServicesPageContent } from "@/components/services/services-page";

export const metadata: Metadata = {
  title: "Building Services",
  description:
    "Painting, plastering, tiling, brickwork, carpentry, plumbing, electrics, drainage, and concrete — delivered by a coordinated team across London and Essex.",
};

export default function ServicesPage() {
  const serviceArea = (process.env.NEXT_PUBLIC_BUSINESS_SERVICE_AREAS ?? "London, South Ockendon, Grays")
    .split(",")
    .map((area) => area.trim())
    .filter(Boolean);
  const serviceAreasLabel = serviceArea.join(", ");
  const primaryArea = serviceArea[0] ?? "London";
  const phoneNumber = process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "07572138829";

  return (
    <main id="main-content" className="min-h-screen bg-stone-white">
      <ServicesHero primaryArea={primaryArea} serviceAreasLabel={serviceAreasLabel} />

      <div className="mx-auto max-w-6xl px-6 pb-16 pt-16 sm:px-10 sm:pb-20">
        <ServicesPageContent
          primaryArea={primaryArea}
          serviceAreasLabel={serviceAreasLabel}
          phoneNumber={phoneNumber}
        />
      </div>
    </main>
  );
}
