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

  const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME ?? "Krishan Construction Group";
  const serviceArea = (process.env.NEXT_PUBLIC_BUSINESS_SERVICE_AREAS ?? "Vancouver, Surrey, Burnaby")
    .split(",")
    .map((area) => area.trim())
    .filter(Boolean);
  const phoneNumber = process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "+1-604-000-0000";
  const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "https://www.krishanconstruction.com";

  // Compute aggregate rating for the hero trust badge
  const reviewCount = testimonials.length;
  const averageRating =
    reviewCount > 0
      ? testimonials.reduce((sum, t) => sum + t.rating, 0) / reviewCount
      : null;

  // Pass the first two project images as hero side panels
  const heroImages = [latestProjects[0]?.image, latestProjects[1]?.image];

  return (
    <main id="main-content" className="min-h-screen bg-stone-white">
      <LocalBusinessJsonLd
        businessName={businessName}
        serviceArea={serviceArea}
        phoneNumber={phoneNumber}
        websiteUrl={websiteUrl}
      />

      {/* ── Parallax hero with side imagery ── */}
      <HeroSection
        images={heroImages}
        headline="Premium Construction for Every Project"
        subheadline="Trusted builders delivering quality craftsmanship, on time and on budget."
        averageRating={averageRating}
        reviewCount={reviewCount}
        trustLine="Fully Insured & Certified"
        primaryCta={{ label: "Get a Free Quote", href: "#contact" }}
        secondaryCta={{ label: "View Our Projects", href: "#projects" }}
      />

      {/* ── Featured project ── */}
      <section id="services" className="bg-parchment">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
          <ScrollReveal delay={0.04}>
            <ProjectHero project={latestProjects[0] ?? null} />
          </ScrollReveal>
        </div>
      </section>

      {/* ── Project gallery ── */}
      <section id="projects" className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <ScrollReveal delay={0.04}>
          <ProjectGallery />
        </ScrollReveal>
      </section>

      {/* ── Testimonials ── */}
      {testimonials.length > 0 ? (
        <section className="bg-parchment" aria-labelledby="testimonials-heading">
          <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
            <ScrollReveal delay={0.04}>
              <SectionTitle eyebrow="What Clients Say" title="Client Testimonials" />
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <div className="mt-12 grid gap-6 sm:grid-cols-2">
                {testimonials.slice(0, 4).map((testimonial) => (
                  <article
                    key={testimonial._id}
                    className="flex flex-col rounded-2xl border border-graphite/8 bg-stone-white p-6 shadow-sm"
                  >
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

                    <p className="mt-4 flex-1 text-sm leading-relaxed text-warm-mist">
                      {testimonial.content}
                    </p>

                    <div className="mt-5 flex items-end justify-between gap-4 border-t border-graphite/8 pt-4">
                      <div>
                        <p className="text-sm font-semibold text-graphite">{testimonial.clientName}</p>
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
      <section id="contact" className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <ScrollReveal delay={0.04}>
          <LeadCaptureForm />
        </ScrollReveal>
      </section>
    </main>
  );
}
