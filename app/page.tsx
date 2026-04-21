import { LeadCaptureForm } from "@/components/lead-capture-form";
import { ProjectGallery } from "@/components/project-gallery";
import { ProjectHero } from "@/components/project-hero";
import { LocalBusinessJsonLd } from "@/components/seo/local-business-jsonld";
import { SectionTitle } from "@/components/ui/section-title";
import { getLatestProjectsForGallery } from "@/lib/sanity.queries";

export default async function Home() {
  const latestProjects = await getLatestProjectsForGallery();
  const featuredProject = latestProjects[0] ?? null;
  const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME ?? "Krishan Construction Group";
  const serviceArea = (process.env.NEXT_PUBLIC_BUSINESS_SERVICE_AREAS ?? "Vancouver, Surrey, Burnaby")
    .split(",")
    .map((area) => area.trim())
    .filter(Boolean);
  const phoneNumber = process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "+1-604-000-0000";
  const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "https://www.krishanconstruction.com";

  return (
    <main id="main-content" className="min-h-screen bg-off-white px-6 py-16 sm:px-10">
      <LocalBusinessJsonLd
        businessName={businessName}
        serviceArea={serviceArea}
        phoneNumber={phoneNumber}
        websiteUrl={websiteUrl}
      />
      <section className="mx-auto max-w-6xl space-y-10 rounded-2xl border border-dark-slate/10 bg-white p-8 shadow-sm sm:p-12">
        <SectionTitle
          eyebrow="Built for Endurance"
          title="High-End Construction Digital Presence"
          description="A production-ready Next.js starter with App Router, TypeScript, and a premium construction color system."
        />

        <div className="grid gap-4 text-sm sm:grid-cols-3">
          <div className="rounded-xl bg-dark-slate p-5 text-off-white">
            <p className="font-semibold">Dark Slate</p>
            <p className="mt-2 text-off-white/75">Primary brand foundation</p>
          </div>
          <div className="rounded-xl bg-industrial-orange p-5 text-off-white">
            <p className="font-semibold">Industrial Orange</p>
            <p className="mt-2 text-off-white/85">Action and emphasis</p>
          </div>
          <div className="rounded-xl border border-dark-slate/20 bg-off-white p-5 text-dark-slate">
            <p className="font-semibold">Off-White</p>
            <p className="mt-2 text-steel-gray">Clean premium backdrop</p>
          </div>
        </div>

        <ProjectHero project={featuredProject} />
        <ProjectGallery />
        <LeadCaptureForm />
      </section>
    </main>
  );
}
