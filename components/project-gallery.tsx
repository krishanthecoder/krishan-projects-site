"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { sortGalleryCategoriesAlphabetically } from "@/lib/gallery-category-sort";
import { buildImageAltText } from "@/lib/project-image-alt";
import {
  type GalleryCategory,
  type GalleryProjectCard,
  getGalleryFilterData,
} from "@/lib/sanity.queries";

import { SanityImage } from "./sanity-image";

/**
 * Gallery filter motion — v2 (keep when iterating; revert by restoring ScrollReveal per card).
 * - Keyed grid by `selectedSlug` so each filter change is a new presence lifecycle.
 * - Enter: staggered card scale+fade (distinct from site `ScrollReveal` slide-from-scroll).
 * - Exit: `AnimatePresence mode="wait"` — cards stagger out (reverse), then the next grid enters.
 */
const FILTER_EASE = [0.22, 1, 0.36, 1] as const;

const filterGridVariantsV2 = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.04,
    },
  },
  exit: {
    transition: {
      when: "afterChildren",
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
};

const filterCardVariantsV2 = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.42, ease: FILTER_EASE },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.16, ease: FILTER_EASE },
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

type ProjectGalleryProps = {
  /** When false, omit the built-in headline block (page-level SectionTitle provides the title). */
  showHeadline?: boolean;
  /** Server-fetched gallery data — avoids browser CORS to Sanity on production. */
  initialData?: {
    categories: GalleryCategory[];
    projects: GalleryProjectCard[];
  };
};

export function ProjectGallery({
  showHeadline = true,
  initialData,
}: ProjectGalleryProps) {
  const [projects, setProjects] = useState<GalleryProjectCard[]>(
    initialData?.projects ?? [],
  );
  const [categories, setCategories] = useState<GalleryCategory[]>(
    initialData?.categories ?? [],
  );
  const [selectedSlug, setSelectedSlug] = useState("");
  const [isLoading, setIsLoading] = useState(!initialData);
  const [hasError, setHasError] = useState(false);

  const sortedCategories = useMemo(
    () => sortGalleryCategoriesAlphabetically(categories),
    [categories],
  );

  const filteredProjects = useMemo(() => {
    if (!selectedSlug) return projects;
    return projects.filter((p) =>
      p.galleryCategories.some((c) => c.slug === selectedSlug),
    );
  }, [projects, selectedSlug]);

  const selectedCategoryTitle = useMemo(
    () => sortedCategories.find((c) => c.slug === selectedSlug)?.title ?? "",
    [selectedSlug, sortedCategories],
  );

  const selectCategorySlug = useCallback((slug: string) => {
    setSelectedSlug(slug);
  }, []);

  useEffect(() => {
    if (initialData) return;

    let active = true;

    async function loadGallery() {
      try {
        const { categories: nextCategories, projects: nextProjects } =
          await getGalleryFilterData();
        if (!active) return;
        setCategories(nextCategories);
        setProjects(nextProjects);
      } catch (error) {
        console.error("Failed to load project gallery", error);
        if (active) setHasError(true);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadGallery();
    return () => {
      active = false;
    };
  }, [initialData]);

  const sectionAriaProps = showHeadline
    ? ({ "aria-labelledby": "project-gallery-heading" } as const)
    : ({ "aria-label": "Project photo gallery" } as const);

  return (
    <section
      className="space-y-6"
      {...sectionAriaProps}
      aria-busy={isLoading}
    >
      {showHeadline ? (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Recent jobs
          </p>
          <h2
            id="project-gallery-heading"
            className="text-3xl font-bold tracking-tight text-graphite sm:text-4xl"
          >
            Real homes we&apos;ve worked on across London
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-warm-mist sm:text-base">
            Have a look at the standard of finish, the detail on kitchens and bathrooms, and how we leave a site. These are recent renovation, extension and kitchen fitting jobs — not stock photos.
          </p>
        </div>
      ) : null}

      {!isLoading && !hasError && projects.length > 0 ? (
        <div className="relative z-10 flex flex-col gap-3">
          <p
            id="gallery-category-filter-label"
            className="text-xs font-semibold uppercase tracking-[0.15em] text-warm-mist"
          >
            Filter projects
          </p>
          <div
            role="radiogroup"
            aria-labelledby="gallery-category-filter-label"
            className="flex flex-wrap gap-2"
          >
            <button
              type="button"
              role="radio"
              aria-checked={selectedSlug === ""}
              onClick={() => selectCategorySlug("")}
              className={`cursor-pointer rounded-full border px-4 py-2.5 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${
                selectedSlug === ""
                  ? "border-gold bg-gold/15 text-graphite shadow-sm"
                  : "border-graphite/15 bg-stone-white text-graphite hover:border-graphite/30 hover:bg-parchment"
              }`}
            >
              All Projects
            </button>
            {sortedCategories.map((category) => {
              const active = selectedSlug === category.slug;
              return (
                <button
                  key={category.slug}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => selectCategorySlug(category.slug)}
                  className={`cursor-pointer rounded-full border px-4 py-2.5 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${
                    active
                      ? "border-gold bg-gold/15 text-graphite shadow-sm"
                      : "border-graphite/15 bg-stone-white text-graphite hover:border-graphite/30 hover:bg-parchment"
                  }`}
                >
                  {category.title}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {isLoading ? (
        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          role="status"
          aria-label="Loading project gallery"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`gallery-skeleton-${index}`}
              className="h-64 animate-pulse rounded-2xl bg-parchment"
              aria-hidden="true"
            />
          ))}
        </div>
      ) : null}

      {!isLoading && hasError ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
          We could not load the latest gallery right now. Please try again shortly.
        </p>
      ) : null}

      {!isLoading &&
      !hasError &&
      projects.length > 0 &&
      filteredProjects.length === 0 &&
      selectedSlug ? (
        <p className="rounded-2xl border border-graphite/10 bg-parchment p-6 text-sm text-graphite/85">
          No projects are tagged with{" "}
          <span className="font-semibold text-graphite">
            {selectedCategoryTitle || "this category"}
          </span>{" "}
          yet. Try another category or tap &ldquo;All Projects&rdquo;.
        </p>
      ) : null}

      {!isLoading && !hasError ? (
        filteredProjects.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSlug || "all"}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              animate="show"
              exit="exit"
              variants={filterGridVariantsV2}
            >
              {filteredProjects.map((item) => {
                if (!item.cardImage) return null;
                return (
                  <motion.div
                    key={item._id}
                    variants={filterCardVariantsV2}
                    className="h-64"
                  >
                    <Link
                      href={`/projects/${item.slug}`}
                      className="group relative block h-full overflow-hidden rounded-2xl border border-graphite/8 bg-parchment text-left shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                      aria-label={`View project: ${item.title}`}
                    >
                      <SanityImage
                        image={item.cardImage}
                        alt={buildImageAltText(
                          item.cardImage.alt,
                          item.title,
                          item.services,
                          item.projectLocation,
                        )}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-graphite/80 via-graphite/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="absolute inset-x-0 bottom-0 px-5 py-4">
                        <p className="text-sm font-semibold text-stone-white">{item.title}</p>
                        {item.projectLocation ? (
                          <p className="mt-0.5 text-xs text-stone-white/75">{item.projectLocation}</p>
                        ) : null}
                        {item.projectValue ? (
                          <p className="mt-2 inline-block rounded-full border border-gold/50 bg-gold/20 px-2.5 py-0.5 text-xs font-semibold text-gold backdrop-blur-sm">
                            {formatGbpValue(item.projectValue)}
                          </p>
                        ) : null}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        ) : projects.length === 0 ? (
          <p className="rounded-2xl border border-graphite/10 bg-parchment p-6 text-sm text-warm-mist">
            Add projects in Sanity Studio with a slug and featured image (or gallery photos) to show them here.
          </p>
        ) : null
      ) : null}
    </section>
  );
}
