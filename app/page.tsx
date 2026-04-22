import { HeroSection } from "@/components/hero-section";
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
    <main id="main-content" className="min-h-screen bg-stone-white">
      <LocalBusinessJsonLd
        businessName={businessName}
        serviceArea={serviceArea}
        phoneNumber={phoneNumber}
        websiteUrl={websiteUrl}
      />

      {/* ── Parallax hero ──
          Uses the featured project image as the background if available,
          falls back to a warm stone gradient. */}
      <HeroSection image={featuredProject?.image ?? null}>
        <ScrollReveal>
          <SectionTitle
            as="h1"
            eyebrow="Built for Endurance"
            title="High-End Construction Digital Presence"
            description="A production-ready Next.js starter with App Router, TypeScript, and a premium construction design system."
          />
        </ScrollReveal>

        {/* Palette swatches */}
        <ScrollReveal delay={0.06}>
          <div className="mt-12 grid gap-4 text-sm sm:grid-cols-3">
            <div className="rounded-2xl bg-graphite p-6 text-stone-white shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-white/50">
                Primary
              </p>
              <p className="mt-2 font-semibold">Graphite</p>
              <p className="mt-1 text-stone-white/60">Brand foundation</p>
            </div>
            <div className="rounded-2xl bg-gold p-6 text-stone-white shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-white/60">
                Accent
              </p>
              <p className="mt-2 font-semibold">Antique Gold</p>
              <p className="mt-1 text-stone-white/75">Premium emphasis</p>
            </div>
            <div className="rounded-2xl border border-graphite/10 bg-parchment p-6 text-graphite shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-warm-mist">
                Surface
              </p>
              <p className="mt-2 font-semibold">Parchment</p>
              <p className="mt-1 text-warm-mist">Warm neutral backdrop</p>
            </div>
          </div>
        </ScrollReveal>
      </HeroSection>

      {/* ── Featured project ── */}
      <section className="bg-parchment">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
          <ScrollReveal delay={0.04}>
            <ProjectHero project={featuredProject} />
          </ScrollReveal>
        </div>
      </section>

      {/* ── Project gallery ── */}
      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <ScrollReveal delay={0.04}>
          <ProjectGallery />
        </ScrollReveal>
      </section>

      {/* ── Testimonials ── */}
      {testimonials.length > 0 ? (
        <section className="bg-parchment" aria-labelledby="testimonials-heading">
          <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
            <ScrollReveal delay={0.04}>
              <SectionTitle
                eyebrow="What Clients Say"
                title="Client Testimonials"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <div className="mt-12 grid gap-6 sm:grid-cols-2">
                {testimonials.slice(0, 4).map((testimonial) => (
                  <article
                    key={testimonial._id}
                    className="flex flex-col rounded-2xl border border-graphite/8 bg-stone-white p-6 shadow-sm"
                  >
                    {/* Stars */}
                    <div
                      className="flex items-center gap-1"
                      aria-label={`Rating: ${testimonial.rating} out of 5`}
                    >
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span
                          key={`${testimonial._id}-star-${index}`}
                          aria-hidden="true"
                          className={`text-sm leading-none ${
                            index < testimonial.rating ? "text-gold" : "text-gold/25"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    {/* Review body */}
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-warm-mist">
                      {testimonial.content}
                    </p>

                    {/* Attribution */}
                    <div className="mt-5 flex items-end justify-between gap-4 border-t border-graphite/8 pt-4">
                      <div>
                        <p className="text-sm font-semibold text-graphite">
                          {testimonial.clientName}
                        </p>
                        {testimonial.jobTitle ? (
                          <p className="mt-0.5 text-xs text-warm-mist">{testimonial.jobTitle}</p>
                        ) : null}
                      </div>
                      {formatPostedDate(testimonial.createdAt) ? (
                        <p className="shrink-0 text-xs text-warm-mist/70">
                          {formatPostedDate(testimonial.createdAt)}
                        </p>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>
      ) : null}

      {/* ── Lead capture form ── */}
      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <ScrollReveal delay={0.04}>
          <LeadCaptureForm />
        </ScrollReveal>
      </section>
    </main>
  );
}
