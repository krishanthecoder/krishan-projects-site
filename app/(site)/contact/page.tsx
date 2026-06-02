import { ContactMapHero } from "@/components/contact/contact-map";
import { LeadCaptureForm } from "@/components/lead-capture-form";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export default function ContactPage() {
  return (
    <main id="main-content" className="min-h-screen bg-stone-white">
      <ContactMapHero />

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-12 sm:px-10 sm:pb-24 sm:pt-14">
        <ScrollReveal>
          <LeadCaptureForm />
        </ScrollReveal>
      </div>
    </main>
  );
}
