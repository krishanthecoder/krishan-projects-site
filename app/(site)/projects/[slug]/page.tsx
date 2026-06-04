import type { Metadata } from "next";
import type { PortableTextBlock } from "@portabletext/types";
import type { ReactNode } from "react";
import type { Image } from "sanity";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

import { ProjectFeaturedMedia } from "@/components/project-featured-media";
import { ProjectPhotoGrid } from "@/components/project-photo-grid";
import { ProjectJsonLd } from "@/components/seo/project-json-ld";
import { SanityImage } from "@/components/sanity-image";
import { ScrollReveal, ScrollRevealGroup } from "@/components/ui/scroll-reveal";
import { sortLabelsAlphabetically } from "@/lib/gallery-category-sort";
import { buildImageAltText } from "@/lib/project-image-alt";
import { buildProjectMetaDescription } from "@/lib/seo/build-project-meta-description";
import {
  getAllProjectSlugs,
  getProjectBySlug,
} from "@/lib/sanity.queries";
import { urlFor } from "@/src/sanity/lib/imageHelpers";

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
    return {
      title: "Project",
      robots: { index: false, follow: true },
    };
  }

  const description = buildProjectMetaDescription(project);
  const canonicalPath = `/projects/${project.slug}`;
  const ogImages = project.featuredImage?.asset
    ? [
        {
          url: urlFor(project.featuredImage as Image)
            .width(1200)
            .height(630)
            .fit("crop")
            .auto("format")
            .url(),
          width: 1200,
          height: 630,
          alt: buildImageAltText(
            project.featuredImage.alt,
            project.title,
            project.services,
            project.projectLocation,
          ),
        },
      ]
    : undefined;

  const keywords = Array.from(
    new Set(
      [
        ...(project.services ?? []).map((s) => s.trim()).filter(Boolean),
        ...(project.projectLocation ? [project.projectLocation] : []),
        project.title,
        "home renovation",
        "building works",
        businessName,
      ].filter(Boolean),
    ),
  ).slice(0, 24);

  const publishedTime = project.startDate
    ? `${project.startDate}T12:00:00.000Z`
    : undefined;

  return {
    title: project.title,
    description,
    keywords,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: `${project.title} | ${businessName}`,
      description,
      url: canonicalPath,
      siteName: businessName,
      locale: "en_GB",
      type: "article",
      images: ogImages,
      publishedTime,
      modifiedTime: project._updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | ${businessName}`,
      description,
      images: ogImages?.map((img) => img.url),
    },
    robots: { index: true, follow: true },
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

  const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "https://krishanprojects.co.uk";
  const siteOrigin = websiteUrl.replace(/\/$/, "");
  const canonicalUrl = `${siteOrigin}/projects/${project.slug}`;
  const metaDescription = buildProjectMetaDescription(project);
  const heroImageUrl =
    project.featuredImage?.asset
      ? urlFor(project.featuredImage as Image)
          .width(1200)
          .height(630)
          .fit("crop")
          .auto("format")
          .url()
      : undefined;

  const heroRef = project.featuredImage?.asset?._ref;
  const beforeRef = project.beforeImage?.asset?._ref;
  const dedupedThumbs = project.images.filter(
    (img) => img.asset?._ref !== heroRef && img.asset?._ref !== beforeRef,
  );
  const thumbnailImages =
    dedupedThumbs.length > 0 ? dedupedThumbs : project.images;

  const startLabel = formatUkDate(project.startDate);
  const endLabel = formatUkDate(project.endDate);
  const priceLabel = formatGbpValue(project.projectValue);
  const servicePillLabels = sortLabelsAlphabetically([
    ...(project.galleryCategories ?? []).map((tag) => tag.title),
    ...(project.services ?? []),
  ]);
  const showServicesRow = servicePillLabels.length > 0;

  const metadataPillClassName =
    "inline-flex rounded-full border border-gold/35 bg-parchment/80 px-3 py-1 text-xs font-semibold tracking-tight text-graphite sm:text-sm";

  return (
    <main id="main-content" className="min-h-screen bg-stone-white">
      <ProjectJsonLd
        canonicalUrl={canonicalUrl}
        siteUrl={siteOrigin}
        businessName={businessName}
        title={project.title}
        description={metaDescription}
        heroImageUrl={heroImageUrl}
      />
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-14">
        <ScrollRevealGroup>
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
            {showServicesRow ? (
              <div className="basis-full pt-1">
                <dt className="font-semibold text-graphite">Services</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {servicePillLabels.map((label) => (
                    <span key={label} className={metadataPillClassName}>
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
          <ScrollReveal className="mt-10">
            {project.beforeImage?.asset ? (
              <ProjectFeaturedMedia
                afterImage={project.featuredImage}
                beforeImage={project.beforeImage}
                useSlider={project.beforeAfterAligned}
                projectTitle={project.title}
                projectLocation={project.projectLocation}
                services={project.services}
                afterAltFromCms={project.featuredImage.alt}
                beforeAltFromCms={project.beforeImage.alt}
              />
            ) : (
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
            )}
          </ScrollReveal>
        ) : null}

        <ScrollReveal
          className="mt-10 max-w-3xl space-y-4 text-sm leading-relaxed text-graphite/90 sm:text-base"
        >
          <PortableText
            value={project.description}
            components={projectDescriptionComponents}
          />
        </ScrollReveal>

        {project.images.length > 0 ? (
          <section className="mt-14" aria-labelledby="project-photos-heading">
            <ScrollReveal>
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
        </ScrollRevealGroup>
      </div>
    </main>
  );
}
