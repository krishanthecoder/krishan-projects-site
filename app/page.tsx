import { HeroSection } from "@/components/hero-section";
import { HowWeWorkSteps } from "@/components/how-we-work-steps";
import { ProjectHero } from "@/components/project-hero";
import { LocalBusinessJsonLd } from "@/components/seo/local-business-jsonld";
import { TrustCards } from "@/components/trust-cards";
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

const processSteps = [
  {
    title: "You get in touch",
    body: "Drop us a message or give us a call. We reply the same day, every time — no call centres, no chasing.",
  },
  {
    title: "We visit and quote",
    body: "A free site visit and a clear written quote with no hidden extras. Fixed price wherever the scope allows.",
  },
  {
    title: "We agree a start date",
    body: "A realistic programme, written down up front, so you can plan life and work around what we're doing.",
  },
  {
    title: "Job done, properly",
    body: "A snagging walkthrough together and a tidy handover. We stand behind our work after you move back in.",
  },
] as const;

const pillars = [
  {
    pillar: "Quality",
    title: "Work we're proud to sign off",
    body: "Careful workmanship from trades we actually know — and a finish that still looks right long after we've left.",
    variant: "graphite" as const,
  },
  {
    pillar: "Cleanliness",
    title: "Tidy sites, every day",
    body: "Dust sheets down, tools away, floors swept at the end of each day. It's still your home while we're in it.",
    variant: "gold" as const,
  },
  {
    pillar: "Fixed Timelines",
    title: "Real dates we stick to",
    body: "Honest timelines agreed up front, with proactive updates if anything shifts. No vague \"next week\" promises.",
    variant: "parchment" as const,
  },
];

const shortlistReasons = [
  "A direct line to the people actually doing the work — not an account manager you've never met.",
  "Clear written quotes with no hidden extras and no surprises mid-job.",
  "Tidy sites, a considerate crew, and dust kept under control.",
  "Realistic timelines we stick to, with honest updates if anything changes.",
];

export default async function Home() {
  const latestProjects = await getLatestProjectsForGallery();
  const testimonials = await getAllTestimonials();
  const featuredProject = latestProjects[0] ?? null;
  const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME ?? "Krishan Projects";
  const serviceArea = (process.env.NEXT_PUBLIC_BUSINESS_SERVICE_AREAS ?? "London, South Ockendon, Grays")
    .split(",")
    .map((area) => area.trim())
    .filter(Boolean);
  const serviceAreasLabel = serviceArea.join(", ");
  const primaryArea = serviceArea[0] ?? "London";
  const phoneNumber = process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "07572138829";
  const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "https://krishanprojects.co.uk";

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
      <HeroSection>
        <div className="hero-fit-grid relative grid gap-8 min-[1300px]:grid-cols-[1fr_300px] min-[1300px]:items-center">
          <div className="hero-fit-copy">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 rounded-full bg-gold/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                <span aria-hidden="true" className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-gold motion-safe:animate-ping motion-safe:[animation-duration:2.4s]" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gold motion-safe:animate-status-blink" />
                </span>
                Currently taking on new work
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.04}>
              <div className="hero-fit-title-wrap mt-6">
                <SectionTitle
                  as="h1"
                  eyebrow={`Small ${primaryArea} Building Team`}
                  title={`Builders and kitchen fitters you can actually trust in ${primaryArea}.`}
                  description={`We're a small team covering ${serviceAreasLabel}. Home renovations, kitchen fitting, extensions and general building works — done properly, kept tidy, and finished when we said we would.`}
                />
              </div>
            </ScrollReveal>

            {/* Personal note from the team */}
            <ScrollReveal delay={0.08}>
              <figure className="hero-fit-note mt-6 flex max-w-xl items-start gap-3 rounded-2xl border border-gold/25 bg-gold/8 p-5 text-graphite sm:p-6">
                <span
                  aria-hidden="true"
                  className="font-serif text-3xl leading-none text-gold"
                >
                  &ldquo;
                </span>
                <div>
                  <blockquote className="text-sm italic leading-relaxed text-graphite/90 sm:text-base">
                    We started {businessName} because we wanted to do things properly — give homeowners our full attention, be honest about timings, and take real pride in every job.
                  </blockquote>
                  <figcaption className="mt-2 text-xs font-semibold not-italic text-gold">
                    &mdash; The {businessName} team
                  </figcaption>
                </div>
              </figure>
            </ScrollReveal>

            <ScrollReveal delay={0.12}>
              <div className="hero-fit-cta mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-graphite px-6 py-3 text-sm font-semibold text-stone-white shadow-sm transition hover:bg-graphite/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                >
                  Get a free quote
                </a>
                <a
                  href="/gallery"
                  className="inline-flex items-center justify-center rounded-xl border border-graphite/15 bg-stone-white px-6 py-3 text-sm font-semibold text-graphite transition hover:border-gold/60 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                >
                  See our recent work
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.16}>
              <p className="hero-fit-call mt-6 text-sm leading-relaxed text-warm-mist sm:text-[0.95rem]">
                Or call us on{" "}
                <a
                  href={`tel:${phoneNumber.replace(/\s/g, "")}`}
                  className="font-semibold text-gold hover:text-gold/80"
                >
                  {phoneNumber}
                </a>
                {" "}— we&apos;ll get back to you the same day.
              </p>
            </ScrollReveal>
          </div>

          {/* Sticky-note style Trust Card for Desktop */}
          <div className="hero-fit-trust hidden min-[1300px]:block">
            <div className="hero-fit-trust-inner">
              <TrustCards />
            </div>
          </div>
        </div>

        {/* Reviews card below CTA on sub-1300 layouts */}
        <div className="mt-10 min-[1300px]:hidden">
          <TrustCards />
        </div>

      </HeroSection>

      {/* ── Brand Pillars ── */}
      <section id="brand-pillars" className="border-b border-graphite/8 bg-stone-white py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <ScrollReveal delay={0.04}>
            <div className="mb-8">
              <SectionTitle
                eyebrow="Why Homeowners Choose Us"
                title="Built around quality, cleanliness, and clear timelines"
                description="Everything we do on site follows these three principles so you always know the standard to expect."
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="grid gap-4 sm:grid-cols-3">
              {pillars.map((card) => {
                const wrapperClass =
                  card.variant === "graphite"
                    ? "rounded-2xl bg-graphite p-6 text-stone-white shadow-sm"
                    : card.variant === "gold"
                      ? "rounded-2xl bg-gold p-6 text-stone-white shadow-sm"
                      : "rounded-2xl border border-graphite/10 bg-parchment p-6 text-graphite shadow-sm";

                const labelClass =
                  card.variant === "graphite"
                    ? "text-xs font-semibold uppercase tracking-[0.15em] text-stone-white/60"
                    : card.variant === "gold"
                      ? "text-xs font-semibold uppercase tracking-[0.15em] text-stone-white/75"
                      : "text-xs font-semibold uppercase tracking-[0.15em] text-warm-mist";

                const bodyClass =
                  card.variant === "graphite"
                    ? "mt-1 text-stone-white/75"
                    : card.variant === "gold"
                      ? "mt-1 text-stone-white/85"
                      : "mt-1 text-warm-mist";

                return (
                  <div key={card.pillar} className={wrapperClass}>
                    <p className={labelClass}>{card.pillar}</p>
                    <p className="mt-2 font-semibold">{card.title}</p>
                    <p className={bodyClass}>{card.body}</p>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Areas we cover ── */}
      <section
        aria-label="Areas we cover"
        className="border-y border-graphite/8 bg-parchment"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:gap-5 sm:px-10">
          <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.15em] text-warm-mist">
            Areas we cover
          </p>
          <ul className="flex flex-wrap gap-2">
            {serviceArea.map((area) => (
              <li
                key={area}
                className="rounded-full border border-graphite/10 bg-stone-white px-3 py-1 text-xs font-medium text-graphite/80"
              >
                {area}
              </li>
            ))}
            <li className="rounded-full border border-graphite/10 bg-stone-white px-3 py-1 text-xs font-medium text-warm-mist">
              + nearby
            </li>
          </ul>
        </div>
      </section>

      {/* ── Featured project ── */}
      <section className="bg-parchment">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-20">
          <ScrollReveal delay={0.04}>
            <ProjectHero project={featuredProject} />
          </ScrollReveal>
        </div>
      </section>

      {/* ── About + How we work ── */}
      <section
        className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-20"
        aria-labelledby="about-heading"
      >
        <ScrollReveal delay={0.04}>
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            {/* About the team */}
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                About {businessName}
              </p>
              <h2
                id="about-heading"
                className="text-3xl font-bold tracking-tight text-graphite sm:text-4xl"
              >
                A small {primaryArea} building team — not a faceless company
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-graphite/85 sm:text-base">
                We&apos;re a small team of builders and fitters based in {primaryArea}, working directly with homeowners across {serviceAreasLabel}. No call centres. No rotating account managers. You get the same faces from the first quote to the day we hand the keys back.
              </p>
              <p className="max-w-xl text-sm leading-relaxed text-graphite/85 sm:text-base">
                Between us we&apos;ve got years of hands-on experience across kitchen fitting, full home renovations, extensions and general building works. We set this team up because we wanted to do things properly — honest pricing, tidy sites, and the level of care you&apos;d want in your own home.
              </p>

              <div className="mt-6 rounded-2xl border border-graphite/10 bg-stone-white p-6 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-graphite/70">
                  Why homeowners shortlist us
                </h3>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-graphite/85">
                  {shortlistReasons.map((reason) => (
                    <li key={reason} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                      />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* How we work */}
            <div
              className="rounded-3xl border border-graphite/10 bg-parchment p-8 shadow-sm sm:p-10 lg:mt-10"
              aria-labelledby="how-we-work-heading"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                How we work
              </p>
              <h3
                id="how-we-work-heading"
                className="mt-2 text-2xl font-bold tracking-tight text-graphite sm:text-3xl"
              >
                A simple, honest process
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-graphite/85">
                No middlemen, no call centres — just our team, from first message to snagging walkthrough.
              </p>

              <HowWeWorkSteps steps={processSteps.map((step) => ({ title: step.title, body: step.body }))} />
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Testimonials ── */}
      {testimonials.length > 0 ? (
        <section className="bg-parchment" aria-labelledby="testimonials-heading">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-20">
            <ScrollReveal delay={0.04}>
              <SectionTitle
                id="testimonials-heading"
                eyebrow="What homeowners say"
                title={`Homeowners in ${primaryArea} who\u2019ve hired us`}
                description="Reviews from clients who wanted tidy, reliable builders — not a big-name contractor."
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
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-graphite/85">
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
    </main>
  );
}
