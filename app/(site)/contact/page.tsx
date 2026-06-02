import { SectionTitle } from "@/components/ui/section-title";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { LeadCaptureForm } from "@/components/lead-capture-form";

export default function ContactPage() {
  return (
    <main id="main-content" className="min-h-screen bg-stone-white">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
        <ScrollReveal>
          <SectionTitle
            eyebrow="Get in Touch"
            title="Start Your Project"
            description="Ready to discuss your home renovation? Message us today for a free site visit and quote."
          />
        </ScrollReveal>

        <div className="mt-16">
          <LeadCaptureForm />
        </div>
      </div>
    </main>
  );
}
