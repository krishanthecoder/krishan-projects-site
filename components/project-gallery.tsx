"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  type GalleryCategory,
  type GalleryImageItem,
  getGalleryFilterData,
} from "@/lib/sanity.queries";

import { SanityImage } from "./sanity-image";

function formatGbpValue(value?: number) {
  if (typeof value !== "number") return null;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatProjectScope(services: string[] = []) {
  const cleanedServices = services
    .map((service) => service.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (cleanedServices.length === 0) return "home renovation";
  if (cleanedServices.length === 1) return cleanedServices[0];
  return `${cleanedServices[0]} and ${cleanedServices[1]}`;
}

function buildImageAltText(
  cmsAltText: string | undefined,
  projectTitle: string,
  projectServices: string[] | undefined,
  projectLocation?: string,
) {
  const trimmedAltText = cmsAltText?.trim();
  if (trimmedAltText) return trimmedAltText;
  const scope = formatProjectScope(projectServices);
  return `${scope} by ${projectTitle}${projectLocation ? ` in ${projectLocation}` : " in London"}`;
}

const modalNavButtonClass =
  "absolute top-1/2 z-[60] inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-stone-white/20 bg-stone-white/10 text-stone-white shadow-sm backdrop-blur-sm transition hover:bg-stone-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:pointer-events-none disabled:opacity-30";

type ProjectGalleryProps = {
  /** When false, omit the built-in headline block (page-level SectionTitle provides the title). */
  showHeadline?: boolean;
};

export function ProjectGallery({ showHeadline = true }: ProjectGalleryProps) {
  const [images, setImages] = useState<GalleryImageItem[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const filteredLengthRef = useRef(0);

  const filteredImages = useMemo(() => {
    if (!selectedSlug) return images;
    return images.filter((item) =>
      item.galleryCategories.some((c) => c.slug === selectedSlug),
    );
  }, [images, selectedSlug]);

  const selectedCategoryTitle = useMemo(
    () => categories.find((c) => c.slug === selectedSlug)?.title ?? "",
    [categories, selectedSlug],
  );

  const selectCategorySlug = useCallback((slug: string) => {
    setSelectedSlug(slug);
    setSelectedIndex(null);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedIndex(null);
    requestAnimationFrame(() => {
      lastFocusedRef.current?.focus();
    });
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setSelectedIndex((i) =>
          i !== null && i > 0 ? i - 1 : i,
        );
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setSelectedIndex((i) =>
          i !== null && i < filteredLengthRef.current - 1 ? i + 1 : i,
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedIndex, closeModal]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedIndex]);

  useLayoutEffect(() => {
    filteredLengthRef.current = filteredImages.length;
  }, [filteredImages.length]);

  useEffect(() => {
    let active = true;

    async function loadGallery() {
      try {
        const { categories: nextCategories, images: nextImages } =
          await getGalleryFilterData();
        if (!active) return;
        setCategories(nextCategories);
        setImages(nextImages);
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
  }, []);

  const selectedImage =
    selectedIndex !== null ? filteredImages[selectedIndex] : null;
  const selectedImageAlt = selectedImage
    ? buildImageAltText(
        selectedImage.image?.alt,
        selectedImage.projectTitle,
        selectedImage.services,
        selectedImage.projectLocation,
      )
    : "Construction project photo";

  const canPrevModal = selectedIndex !== null && selectedIndex > 0;
  const canNextModal =
    selectedIndex !== null && selectedIndex < filteredImages.length - 1;

  const sectionAriaProps = showHeadline
    ? ({ "aria-labelledby": "project-gallery-heading" } as const)
    : ({ "aria-label": "Project photo gallery" } as const);

  return (
    <>
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

        {!isLoading && !hasError && images.length > 0 ? (
          <div className="relative z-10 flex flex-col gap-3">
            <p
              id="gallery-category-filter-label"
              className="text-xs font-semibold uppercase tracking-[0.15em] text-warm-mist"
            >
              Filter by job category
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
                All job categories
              </button>
              {categories.map((category) => {
                const active = selectedSlug === category.slug;
                return (
                  <button
                    key={category._id}
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

        {/* Skeleton */}
        {isLoading ? (
          <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            role="status"
            aria-label="Loading project gallery images"
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

        {/* Error */}
        {!isLoading && hasError ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
            We could not load the latest gallery right now. Please try again shortly.
          </p>
        ) : null}

        {/* Filtered empty */}
        {!isLoading &&
        !hasError &&
        images.length > 0 &&
        filteredImages.length === 0 &&
        selectedSlug ? (
          <p className="rounded-2xl border border-graphite/10 bg-parchment p-6 text-sm text-graphite/85">
            No photos are tagged with{" "}
            <span className="font-semibold text-graphite">
              {selectedCategoryTitle || "this category"}
            </span>{" "}
            yet. Try another category or tap &ldquo;All job categories&rdquo;.
          </p>
        ) : null}

        {/* Gallery grid */}
        {!isLoading && !hasError ? (
          filteredImages.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredImages.map((item, index) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={(event) => {
                    lastFocusedRef.current = event.currentTarget;
                    setSelectedIndex(index);
                  }}
                  className="group relative h-64 overflow-hidden rounded-2xl border border-graphite/8 bg-parchment text-left shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                  aria-label={`Open image: ${buildImageAltText(item.image?.alt, item.projectTitle, item.services, item.projectLocation)}`}
                >
                  <SanityImage
                    image={item.image}
                    alt={buildImageAltText(
                      item.image?.alt,
                      item.projectTitle,
                      item.services,
                      item.projectLocation,
                    )}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-graphite/80 via-graphite/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute inset-x-0 bottom-0 px-5 py-4">
                    <p className="text-sm font-semibold text-stone-white">{item.projectTitle}</p>
                    {item.projectLocation ? (
                      <p className="mt-0.5 text-xs text-stone-white/75">{item.projectLocation}</p>
                    ) : null}
                    {item.projectValue ? (
                      <p className="mt-2 inline-block rounded-full border border-gold/50 bg-gold/20 px-2.5 py-0.5 text-xs font-semibold text-gold backdrop-blur-sm">
                        {formatGbpValue(item.projectValue)}
                      </p>
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
          ) : images.length === 0 ? (
            <p className="rounded-2xl border border-graphite/10 bg-parchment p-6 text-sm text-warm-mist">
              Photos from our recent jobs will show up here once projects are added in Sanity Studio.
            </p>
          ) : null
        ) : null}
      </section>

      {/* Lightbox modal */}
      {selectedImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/92 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedImage.projectTitle}. ${selectedImageAlt}`}
          onClick={closeModal}
        >
          <button
            type="button"
            className="absolute right-4 top-4 z-[60] rounded-xl bg-stone-white/10 px-4 py-2 text-sm font-semibold text-stone-white ring-1 ring-stone-white/20 backdrop-blur-sm transition hover:bg-stone-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            onClick={closeModal}
            aria-label="Close expanded image"
            autoFocus
          >
            Close
          </button>

          <button
            type="button"
            className={`${modalNavButtonClass} left-4 sm:left-6`}
            aria-label="Previous image"
            disabled={!canPrevModal}
            onClick={(event) => {
              event.stopPropagation();
              setSelectedIndex((i) => (i !== null && i > 0 ? i - 1 : i));
            }}
          >
            <ChevronLeft className="h-6 w-6" aria-hidden />
          </button>

          <button
            type="button"
            className={`${modalNavButtonClass} right-4 sm:right-6`}
            aria-label="Next image"
            disabled={!canNextModal}
            onClick={(event) => {
              event.stopPropagation();
              setSelectedIndex((i) =>
                i !== null && i < filteredImages.length - 1 ? i + 1 : i,
              );
            }}
          >
            <ChevronRight className="h-6 w-6" aria-hidden />
          </button>

          <div
            className="relative h-[78vh] w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <SanityImage
              image={selectedImage.image}
              alt={selectedImageAlt}
              sizes="100vw"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="pointer-events-none absolute left-1/2 top-20 z-[55] -translate-x-1/2 rounded-full bg-graphite/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-white/85 backdrop-blur-sm ring-1 ring-stone-white/15">
            {selectedIndex !== null ? `${selectedIndex + 1} / ${filteredImages.length}` : ""}
          </div>

          <div className="absolute bottom-5 left-5 max-w-[min(22rem,calc(100%-8rem))] rounded-xl bg-graphite/70 px-4 py-2.5 text-xs text-stone-white backdrop-blur-sm ring-1 ring-stone-white/10">
            <p className="font-semibold">{selectedImage.projectTitle}</p>
            {selectedImage.projectLocation ? (
              <p className="mt-0.5 font-medium text-stone-white/85">{selectedImage.projectLocation}</p>
            ) : null}
            {selectedImage.projectValue ? (
              <p className="mt-1 text-stone-white/70">{formatGbpValue(selectedImage.projectValue)}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
