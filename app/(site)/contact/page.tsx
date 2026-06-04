import { ContactHero } from "@/components/contact/contact-hero";
import { LeadCaptureForm } from "@/components/lead-capture-form";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

type ContactPageProps = {
  searchParams: Promise<{ slow?: string }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;

  // Dev-only: append ?slow=1 to hold the response ~5s (for reload screenshots).
  if (process.env.NODE_ENV === "development" && params.slow === "1") {
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  return (
    <main id="main-content" className="min-h-screen bg-stone-white">
      <ContactHero />

      <ScrollReveal className="mx-auto max-w-6xl px-6 pb-20 pt-12 sm:px-10 sm:pb-24 sm:pt-14">
        <LeadCaptureForm />
      </ScrollReveal>
    </main>
  );
}
