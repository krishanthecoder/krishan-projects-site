import type { Metadata } from "next";
import type { PortableTextBlock } from "@portabletext/types";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

import { ProjectPhotoGrid } from "@/components/project-photo-grid";
import { SanityImage } from "@/components/sanity-image";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { buildImageAltText } from "@/lib/project-image-alt";
import {
  getAllProjectSlugs,
  getProjectBySlug,
} from "@/lib/sanity.queries";

const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME ?? "Krishan Projects";

/**
 * One renderer for all block styles so Studio choices (Normal vs Code vs Quote vs Lead)
 * cannot drift visually between projects. Headings stay distinct; everything else matches.
 */
function projectDescriptionBlock({
  value,
  children,
}: {
  value: PortableTextBlock;
  children?: ReactNode;
}) {
  const style = value.style ?? "normal";
  if (style === "h1") {
    return (
      <h2 className="mb-3 mt-8 text-2xl font-semibold tracking-tight text-graphite first:mt-0 sm:text-3xl">
        {children}
      </h2>
    );
  }
  if (style === "h2") {
    return (
      <h2 className="mb-3 mt-8 text-xl font-semibold tracking-tight text-graphite first:mt-0">
        {children}
      </h2>
    );
  }
  if (style === "h3") {
    return (
      <h3 className="mb-2 mt-6 text-lg font-semibold text-graphite first:mt-0">
        {children}
      </h3>
    );
  }
  if (style === "h4" || style === "h5" || style === "h6") {
    return (
      <h4 className="mb-2 mt-5 text-base font-semibold text-graphite first:mt-0">
        {children}
      </h4>
    );
  }
  return <p className="mb-4 last:mb-0">{children}</p>;
}

const projectDescriptionComponents: PortableTextComponents = {
  block: projectDescriptionBlock,
  marks: {
    /** Whole paragraphs pasted as “bold” from Word become one strong span — avoid heavy body copy. */
    strong: ({ children }) => (
      <strong className="font-normal text-inherit">{children}</strong>
    ),
    code: ({ children }) => (
      <code className="font-sans text-[0.95em] font-normal text-graphite">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const href =
        typeof value?.href === "string"
          ? value.href
          : typeof (value as { url?: string })?.url === "string"
            ? (value as { url: string }).url
            : "#";
      const openInNewTab = Boolean((value as { blank?: boolean })?.blank);
      return (
        <a
          href={href}
          className="font-medium text-graphite underline decoration-graphite/30 underline-offset-2 hover:decoration-graphite"
          {...(openInNewTab
            ? { target: "_blank", rel: "noreferrer noopener" }
            : {})}
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
};

function formatGbpValue(value?: number) {
  if (typeof value !== "number") return null;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatUkDate(iso?: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    return { title: `Project | ${businessName}` };
  }
  return {
    title: `${project.title} | ${businessName}`,
    description: `${project.title} — ${project.projectLocation ?? "Recent project"}.`,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const heroRef = project.featuredImage?.asset?._ref;
  const dedupedThumbs = project.images.filter((img) => img.asset?._ref !== heroRef);
  const thumbnailImages =
    dedupedThumbs.length > 0 ? dedupedThumbs : project.images;

  const startLabel = formatUkDate(project.startDate);
  const endLabel = formatUkDate(project.endDate);
  const priceLabel = formatGbpValue(project.projectValue);
  const serviceLabels = (project.services ?? [])
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <main id="main-content" className="min-h-screen bg-stone-white">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-14">
        <ScrollReveal>
          <Link
            href="/projects"
            className="text-sm font-semibold text-gold transition hover:text-gold/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
          >
            ← Back to recent projects
          </Link>

          <header className="mt-8 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Project
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-graphite sm:text-4xl">
              {project.title}
            </h1>

            <dl className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-graphite/85">
            {startLabel ? (
              <div>
                <dt className="font-semibold text-graphite">Started</dt>
                <dd>{startLabel}</dd>
              </div>
            ) : null}
            {endLabel ? (
              <div>
                <dt className="font-semibold text-graphite">Finished</dt>
                <dd>{endLabel}</dd>
              </div>
            ) : null}
            {project.projectLocation ? (
              <div>
                <dt className="font-semibold text-graphite">Location</dt>
                <dd>{project.projectLocation}</dd>
              </div>
            ) : null}
            {priceLabel ? (
              <div>
                <dt className="font-semibold text-graphite">Price</dt>
                <dd>{priceLabel}</dd>
              </div>
            ) : null}
            {serviceLabels.length > 0 ? (
              <div className="basis-full pt-1">
                <dt className="font-semibold text-graphite">Services</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {serviceLabels.map((label) => (
                    <span
                      key={label}
                      className="inline-flex rounded-full border border-gold/35 bg-parchment/80 px-3 py-1 text-xs font-semibold tracking-tight text-graphite sm:text-sm"
                    >
                      {label}
                    </span>
                  ))}
                </dd>
              </div>
            ) : null}
            </dl>
          </header>
        </ScrollReveal>

        {project.featuredImage ? (
          <ScrollReveal delay={0.04} className="mt-10">
            <div className="relative h-72 overflow-hidden rounded-3xl border border-graphite/10 shadow-md sm:h-[28rem]">
              <SanityImage
                image={project.featuredImage}
                alt={buildImageAltText(
                  project.featuredImage.alt,
                  project.title,
                  project.services,
                  project.projectLocation,
                )}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 90vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-graphite/70 to-transparent px-6 py-6 sm:px-8 sm:py-8" />
            </div>
          </ScrollReveal>
        ) : null}

        <ScrollReveal
          delay={0.08}
          className="mt-10 max-w-3xl space-y-4 text-sm leading-relaxed text-graphite/90 sm:text-base"
        >
          <PortableText
            value={project.description}
            components={projectDescriptionComponents}
          />
        </ScrollReveal>

        {project.images.length > 0 ? (
          <section className="mt-14" aria-labelledby="project-photos-heading">
            <ScrollReveal delay={0.12}>
              <h2
                id="project-photos-heading"
                className="text-lg font-bold tracking-tight text-graphite"
              >
                Photos from this job
              </h2>
              <p className="mt-2 text-sm text-graphite/75">
                Tap a photo to open the gallery viewer — use arrow keys or swipe to move between shots.
              </p>
              <div className="mt-6">
                <ProjectPhotoGrid
                  lightboxImages={project.images}
                  thumbnailImages={thumbnailImages}
                  projectTitle={project.title}
                  projectLocation={project.projectLocation}
                  services={project.services}
                />
              </div>
            </ScrollReveal>
          </section>
        ) : null}
      </div>
    </main>
  );
}
