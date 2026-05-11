import { SectionTitle } from "@/components/ui/section-title";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export default function ServicesPage() {
  return (
    <main id="main-content" className="min-h-screen bg-stone-white">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-20">
        <ScrollReveal>
          <SectionTitle
            eyebrow="Our Expertise"
            title="Professional Building Services"
            description="From full home renovations to specialized brickwork, we deliver high-end craftsmanship across every trade."
          />
        </ScrollReveal>
        
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder for services content */}
          <p className="text-warm-mist">Services content coming soon...</p>
        </div>
      </div>
    </main>
  );
}
