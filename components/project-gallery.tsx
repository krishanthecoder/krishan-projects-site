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

export function ProjectGallery() {
  const [images, setImages] = useState<GalleryImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedIndex(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
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
        if (active) {
          setHasError(true);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadGallery();

    return () => {
      active = false;
    };
  }, []);

  const selectedImage = selectedIndex !== null ? images[selectedIndex] : null;
  const selectedImageAlt =
    selectedImage?.image?.alt?.trim() || selectedImage?.projectTitle || "Construction project photo";
  const [lastFocusedElement, setLastFocusedElement] = useState<HTMLElement | null>(null);

  return (
    <>
      <section className="space-y-4" aria-labelledby="project-gallery-heading" aria-busy={isLoading}>
        <h2 id="project-gallery-heading" className="text-2xl font-semibold text-dark-slate sm:text-3xl">
          Project Gallery
        </h2>
        {isLoading ? (
          <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            role="status"
            aria-label="Loading project gallery images"
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`gallery-skeleton-${index}`}
                className="h-64 animate-pulse rounded-xl border border-dark-slate/10 bg-dark-slate/10"
                aria-hidden="true"
              />
            ))}
          </div>
        ) : null}

        {!isLoading && hasError ? (
          <p className="rounded-lg border border-industrial-orange/20 bg-industrial-orange/10 p-4 text-sm text-dark-slate">
            We could not load the latest gallery right now. Please try again shortly.
          </p>
        ) : null}

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
                  className="group relative h-64 overflow-hidden rounded-xl border border-dark-slate/10 bg-dark-slate/5 text-left"
                  aria-label={`Open image: ${item.image?.alt?.trim() || item.projectTitle}`}
                >
                  <SanityImage
                    image={item.image}
                    alt={item.image?.alt?.trim() || item.projectTitle}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark-slate/85 to-transparent px-4 py-3 text-sm font-medium text-off-white">
                    {item.projectTitle}
                    {item.projectLocation ? (
                      <p className="mt-1 text-xs font-normal text-off-white/85">{item.projectLocation}</p>
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dark-slate/10 bg-dark-slate/5 p-4 text-sm text-steel-gray">
              Add projects with images in Sanity Studio to populate this gallery.
            </p>
          )
        ) : null}
      </section>

      {selectedImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-dark-slate/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Expanded image: ${selectedImageAlt}`}
          onClick={() => {
            setSelectedIndex(null);
            lastFocusedElement?.focus();
          }}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-md bg-off-white px-3 py-2 text-sm font-semibold text-dark-slate"
            onClick={() => {
              setSelectedIndex(null);
              lastFocusedElement?.focus();
            }}
            aria-label="Close expanded image"
            autoFocus
          >
            Close
          </button>
          <div
            className="relative h-[75vh] w-full max-w-5xl overflow-hidden rounded-xl"
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
          {(selectedImage.projectLocation || selectedImage.projectValue) ? (
            <div className="absolute bottom-4 left-4 rounded-md bg-dark-slate/80 px-3 py-2 text-xs text-off-white">
              {selectedImage.projectLocation ? <p>{selectedImage.projectLocation}</p> : null}
              {selectedImage.projectValue ? (
                <p>Project Value: {formatGbpValue(selectedImage.projectValue)}</p>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
