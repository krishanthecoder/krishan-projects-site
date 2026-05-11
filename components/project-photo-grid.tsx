"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { buildImageAltText } from "@/lib/project-image-alt";
import type { SanityImage } from "@/lib/sanity.queries";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

import { SanityImage as SanityImageComponent } from "./sanity-image";

const modalNavButtonClass =
  "absolute top-1/2 z-[60] inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-stone-white/20 bg-stone-white/10 text-stone-white shadow-sm backdrop-blur-sm transition hover:bg-stone-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:pointer-events-none disabled:opacity-30";

type ProjectPhotoGridProps = {
  /** Full set for the lightbox carousel (document order). */
  lightboxImages: SanityImage[];
  /** Thumbnails under the hero (deduped by parent if needed). */
  thumbnailImages: SanityImage[];
  projectTitle: string;
  projectLocation?: string;
  services?: string[];
};

export function ProjectPhotoGrid({
  lightboxImages,
  thumbnailImages,
  projectTitle,
  projectLocation,
  services = [],
}: ProjectPhotoGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const lengthRef = useRef(0);

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
        setSelectedIndex((i) => (i !== null && i > 0 ? i - 1 : i));
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setSelectedIndex((i) =>
          i !== null && i < lengthRef.current - 1 ? i + 1 : i,
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
    lengthRef.current = lightboxImages.length;
  }, [lightboxImages.length]);

  const openAtLightboxIndex = useCallback((image: SanityImage) => {
    const idx = lightboxImages.findIndex(
      (img) => img.asset?._ref === image.asset?._ref,
    );
    setSelectedIndex(idx >= 0 ? idx : 0);
  }, [lightboxImages]);

  const selectedImage =
    selectedIndex !== null ? lightboxImages[selectedIndex] : null;
  const selectedAlt = selectedImage
    ? buildImageAltText(
        selectedImage.alt,
        projectTitle,
        services,
        projectLocation,
      )
    : "";

  const canPrev = selectedIndex !== null && selectedIndex > 0;
  const canNext =
    selectedIndex !== null && selectedIndex < lightboxImages.length - 1;

  if (thumbnailImages.length === 0) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {thumbnailImages.map((img, index) => (
          <ScrollReveal
            key={img.asset._ref}
            delay={Math.min(index * 0.05, 0.3)}
            className="h-64"
          >
            <button
              type="button"
              onClick={(event) => {
                lastFocusedRef.current = event.currentTarget;
                openAtLightboxIndex(img);
              }}
              className="group relative h-full w-full cursor-pointer overflow-hidden rounded-2xl border border-graphite/8 bg-parchment text-left shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              aria-label={`Open image: ${buildImageAltText(img.alt, projectTitle, services, projectLocation)}`}
            >
              <SanityImageComponent
                image={img}
                alt={buildImageAltText(img.alt, projectTitle, services, projectLocation)}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </button>
          </ScrollReveal>
        ))}
      </div>

      {selectedImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/92 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${projectTitle}. ${selectedAlt}`}
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
            disabled={!canPrev}
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
            disabled={!canNext}
            onClick={(event) => {
              event.stopPropagation();
              setSelectedIndex((i) =>
                i !== null && i < lightboxImages.length - 1 ? i + 1 : i,
              );
            }}
          >
            <ChevronRight className="h-6 w-6" aria-hidden />
          </button>

          <div
            className="relative h-[78vh] w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <SanityImageComponent
              image={selectedImage}
              alt={selectedAlt}
              sizes="100vw"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="pointer-events-none absolute left-1/2 top-20 z-[55] -translate-x-1/2 rounded-full bg-graphite/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-white/85 backdrop-blur-sm ring-1 ring-stone-white/15">
            {selectedIndex !== null
              ? `${selectedIndex + 1} / ${lightboxImages.length}`
              : ""}
          </div>
        </div>
      ) : null}
    </>
  );
}
