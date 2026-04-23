"use client";

import { useEffect, useState } from "react";

import { type GalleryImageItem, getLatestGalleryImages } from "@/lib/sanity.queries";

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

export function ProjectGallery() {
  const [images, setImages] = useState<GalleryImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [lastFocusedElement, setLastFocusedElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIndex(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadGallery() {
      try {
        const latestImages = await getLatestGalleryImages();
        if (!active) return;
        setImages(latestImages);
      } catch (error) {
        console.error("Failed to load project gallery", error);
        if (active) setHasError(true);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadGallery();
    return () => { active = false; };
  }, []);

  const selectedImage = selectedIndex !== null ? images[selectedIndex] : null;
  const selectedImageAlt = selectedImage
    ? buildImageAltText(
      selectedImage.image?.alt,
      selectedImage.projectTitle,
      selectedImage.services,
      selectedImage.projectLocation,
    )
    : "Construction project photo";

  function closeModal() {
    setSelectedIndex(null);
    lastFocusedElement?.focus();
  }

  return (
    <>
      <section className="space-y-6" aria-labelledby="project-gallery-heading" aria-busy={isLoading}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
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
          {!isLoading && images.length > 0 ? (
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-warm-mist">
              {images.length} project{images.length !== 1 ? "s" : ""}
            </p>
          ) : null}
        </div>

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

        {/* Gallery grid */}
        {!isLoading && !hasError ? (
          images.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((item, index) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={(event) => {
                    setLastFocusedElement(event.currentTarget);
                    setSelectedIndex(index);
                  }}
                  className="group relative h-64 overflow-hidden rounded-2xl border border-graphite/8 bg-parchment text-left shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                  aria-label={`Open image: ${buildImageAltText(item.image?.alt, item.projectTitle, item.services, item.projectLocation)}`}
                >
                  <SanityImage
                    image={item.image}
                    alt={buildImageAltText(item.image?.alt, item.projectTitle, item.services, item.projectLocation)}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  {/* Hover overlay */}
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
          ) : (
            <p className="rounded-2xl border border-graphite/10 bg-parchment p-6 text-sm text-warm-mist">
              Photos from our recent jobs will show up here once projects are added in Sanity Studio.
            </p>
          )
        ) : null}
      </section>

      {/* Lightbox modal */}
      {selectedImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/92 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Expanded image: ${selectedImageAlt}`}
          onClick={closeModal}
        >
          {/* Close button */}
          <button
            type="button"
            className="absolute right-4 top-4 rounded-xl bg-stone-white/10 px-4 py-2 text-sm font-semibold text-stone-white ring-1 ring-stone-white/20 backdrop-blur-sm transition hover:bg-stone-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            onClick={closeModal}
            aria-label="Close expanded image"
            autoFocus
          >
            Close
          </button>

          {/* Image container */}
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

          {/* Caption */}
          {(selectedImage.projectLocation || selectedImage.projectValue) ? (
            <div className="absolute bottom-5 left-5 rounded-xl bg-graphite/70 px-4 py-2.5 text-xs text-stone-white backdrop-blur-sm ring-1 ring-stone-white/10">
              {selectedImage.projectLocation ? (
                <p className="font-medium">{selectedImage.projectLocation}</p>
              ) : null}
              {selectedImage.projectValue ? (
                <p className="mt-0.5 text-stone-white/70">
                  {formatGbpValue(selectedImage.projectValue)}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
