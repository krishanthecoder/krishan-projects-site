"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { Image as SanityCmsImage } from "sanity";

import { ScrollReveal, ScrollRevealGroup } from "@/components/ui/scroll-reveal";
import { imageAssetRef } from "@/lib/image-asset-ref";
import {
  lightboxImageUrl,
  prefetchLightboxImage,
} from "@/lib/lightbox-image";
import { buildImageAltText } from "@/lib/project-image-alt";
import type { SanityImage } from "@/lib/sanity.queries";

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
  const [lightboxReady, setLightboxReady] = useState(false);
  /** Keep the previous slide visible until the next one is decoded. */
  const [heldSrc, setHeldSrc] = useState<string | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const lengthRef = useRef(0);
  const readySrcRef = useRef<string | null>(null);

  const closeModal = useCallback(() => {
    setSelectedIndex(null);
    setHeldSrc(null);
    readySrcRef.current = null;
    setLightboxReady(false);
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

  // Warm lightbox-sized URLs for thumbs while the grid is on screen.
  useEffect(() => {
    if (thumbnailImages.length === 0) return;
    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      for (const img of thumbnailImages) {
        prefetchLightboxImage(img as SanityCmsImage);
      }
    };
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = window.requestIdleCallback(run, { timeout: 1500 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }
    const timeout = window.setTimeout(run, 200);
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [thumbnailImages]);

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
  const selectedSrc = selectedImage
    ? lightboxImageUrl(selectedImage as SanityCmsImage)
    : null;

  // Reveal only after decode; hold the prior frame to avoid blank flashes.
  useLayoutEffect(() => {
    if (selectedIndex === null || !selectedSrc) return;

    if (readySrcRef.current && readySrcRef.current !== selectedSrc) {
      setHeldSrc(readySrcRef.current);
    }
    setLightboxReady(false);

    prefetchLightboxImage(lightboxImages[selectedIndex] as SanityCmsImage);
    prefetchLightboxImage(lightboxImages[selectedIndex - 1] as SanityCmsImage);
    prefetchLightboxImage(lightboxImages[selectedIndex + 1] as SanityCmsImage);

    let cancelled = false;
    const probe = new window.Image();
    probe.decoding = "async";
    probe.src = selectedSrc;

    const markReady = () => {
      if (cancelled) return;
      readySrcRef.current = selectedSrc;
      setLightboxReady(true);
      setHeldSrc(null);
    };

    if (probe.complete && probe.naturalWidth > 0) {
      markReady();
      return () => {
        cancelled = true;
      };
    }

    void probe
      .decode()
      .then(markReady)
      .catch(() => {
        // decode() can fail on some cached/aborted loads — onLoad still covers it.
      });

    return () => {
      cancelled = true;
    };
  }, [selectedIndex, selectedSrc, lightboxImages]);

  const openAtLightboxIndex = useCallback(
    (image: SanityImage) => {
      const clickedKey = image._key;
      const clickedRef = imageAssetRef(image);
      const idx = lightboxImages.findIndex((img) => {
        if (clickedKey && img._key) return img._key === clickedKey;
        const ref = imageAssetRef(img);
        return Boolean(clickedRef && ref && ref === clickedRef);
      });
      setSelectedIndex(idx >= 0 ? idx : 0);
    },
    [lightboxImages],
  );

  const canPrev = selectedIndex !== null && selectedIndex > 0;
  const canNext =
    selectedIndex !== null && selectedIndex < lightboxImages.length - 1;

  if (thumbnailImages.length === 0) {
    return null;
  }

  return (
    <>
      <ScrollRevealGroup
        stagger={0.05}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {thumbnailImages.map((img, thumbIndex) => (
          <ScrollReveal
            key={img._key ?? imageAssetRef(img) ?? `thumb-${thumbIndex}`}
            className="h-64"
          >
            <button
              type="button"
              onClick={(event) => {
                lastFocusedRef.current = event.currentTarget;
                prefetchLightboxImage(img as SanityCmsImage);
                openAtLightboxIndex(img);
              }}
              onMouseEnter={() => prefetchLightboxImage(img as SanityCmsImage)}
              onFocus={() => prefetchLightboxImage(img as SanityCmsImage)}
              onTouchStart={() => prefetchLightboxImage(img as SanityCmsImage)}
              className="group relative h-full w-full cursor-pointer overflow-hidden rounded-2xl border border-graphite/8 bg-parchment text-left shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              aria-label={`Open image: ${buildImageAltText(img.alt, projectTitle, services, projectLocation)}`}
            >
              <SanityImageComponent
                image={img}
                alt={buildImageAltText(
                  img.alt,
                  projectTitle,
                  services,
                  projectLocation,
                )}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </button>
          </ScrollReveal>
        ))}
      </ScrollRevealGroup>

      {selectedImage && selectedSrc ? (
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
            className="relative flex h-[78vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-graphite/40 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative min-h-0 flex-1">
              {heldSrc && heldSrc !== selectedSrc && !lightboxReady ? (
                <Image
                  src={heldSrc}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  unoptimized
                  aria-hidden
                  className="object-contain"
                />
              ) : null}
              <Image
                key={selectedSrc}
                src={selectedSrc}
                alt={selectedAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority
                unoptimized
                className={`object-contain transition-opacity duration-150 ease-out ${
                  lightboxReady ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => {
                  readySrcRef.current = selectedSrc;
                  setLightboxReady(true);
                  setHeldSrc(null);
                }}
              />
            </div>
            {selectedAlt.trim().length > 0 ? (
              <p className="shrink-0 border-t border-stone-white/10 bg-graphite/55 px-4 py-3 text-center text-sm leading-snug text-stone-white/80 sm:px-6">
                {selectedAlt}
              </p>
            ) : null}
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
