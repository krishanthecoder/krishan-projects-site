import { LeadCaptureForm } from "@/components/lead-capture-form";
import { ProjectGallery } from "@/components/project-gallery";
import { ProjectHero } from "@/components/project-hero";
import { LocalBusinessJsonLd } from "@/components/seo/local-business-jsonld";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SectionTitle } from "@/components/ui/section-title";
import { getAllTestimonials, getLatestProjectsForGallery } from "@/lib/sanity.queries";

function formatPostedDate(dateString?: string) {
  if (!dateString) return null;
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return null;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

export default async function Home() {
  const latestProjects = await getLatestProjectsForGallery();
  const testimonials = await getAllTestimonials();
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
        <ScrollReveal>
          <SectionTitle
            eyebrow="Built for Endurance"
            title="High-End Construction Digital Presence"
            description="A production-ready Next.js starter with App Router, TypeScript, and a premium construction color system."
          />
        </ScrollReveal>

        <ScrollReveal delay={0.05}>
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
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <ProjectHero project={featuredProject} />
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <ProjectGallery />
        </ScrollReveal>

        {testimonials.length > 0 ? (
          <ScrollReveal delay={0.12}>
            <section className="space-y-4" aria-labelledby="testimonials-heading">
              <h2 id="testimonials-heading" className="text-2xl font-semibold text-dark-slate sm:text-3xl">
                Client Testimonials
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {testimonials.slice(0, 4).map((testimonial) => (
                  <article
                    key={testimonial._id}
                    className="rounded-xl border border-dark-slate/10 bg-off-white p-5"
                  >
                    <h3 className="text-base font-semibold text-dark-slate">
                      {testimonial.jobTitle || "Client Review"}
                    </h3>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-industrial-orange">{testimonial.clientName}</p>
                      <div className="flex items-center gap-1" aria-label={`Rating: ${testimonial.rating} out of 5`}>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <span
                            key={`${testimonial._id}-star-${index}`}
                            aria-hidden="true"
                            className={index < testimonial.rating ? "text-[#ffde21]" : "text-[#ffde21]/30"}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    {formatPostedDate(testimonial.createdAt) ? (
                      <p className="mt-1 text-xs text-steel-gray">
                        Posted {formatPostedDate(testimonial.createdAt)}
                      </p>
                    ) : null}
                    <p className="mt-3 text-sm leading-6 text-steel-gray">{testimonial.content}</p>
                  </article>
                ))}
              </div>
            </section>
          </ScrollReveal>
        ) : null}

        <ScrollReveal delay={0.14}>
          <LeadCaptureForm />
        </ScrollReveal>
      </section>
    </main>
  );
}
