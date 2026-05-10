"use client";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
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

type GalleryCategoryMenuState = {
  open: boolean;
  highlightIndex: number;
};

export function ProjectGallery({ showHeadline = true }: ProjectGalleryProps) {
  const [images, setImages] = useState<GalleryImageItem[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [categoryMenu, setCategoryMenu] = useState<GalleryCategoryMenuState>({
    open: false,
    highlightIndex: 0,
  });
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const filteredLengthRef = useRef(0);
  const categoryTriggerRef = useRef<HTMLButtonElement>(null);
  const categoryListRef = useRef<HTMLDivElement>(null);

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

  const categoryOptions = useMemo(
    () => [
      { slug: "", title: "All Job Categories" },
      ...categories.map((c) => ({ slug: c.slug, title: c.title })),
    ],
    [categories],
  );

  const categoryTriggerLabel = selectedSlug
    ? selectedCategoryTitle || "Category"
    : "All Job Categories";

  const selectedCategoryOptionIndex = useMemo(
    () =>
      Math.max(
        0,
        categoryOptions.findIndex((o) => o.slug === selectedSlug),
      ),
    [categoryOptions, selectedSlug],
  );

  const selectCategorySlug = useCallback((slug: string) => {
    setSelectedSlug(slug);
    setSelectedIndex(null);
    setCategoryMenu((prev) => ({ ...prev, open: false }));
    categoryTriggerRef.current?.focus();
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

  useLayoutEffect(() => {
    if (!categoryMenu.open) return;
    categoryListRef.current?.focus();
  }, [categoryMenu.open]);

  useEffect(() => {
    if (!categoryMenu.open) return;
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        categoryTriggerRef.current?.contains(target) ||
        categoryListRef.current?.contains(target)
      ) {
        return;
      }
      setCategoryMenu((prev) => ({ ...prev, open: false }));
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [categoryMenu.open]);

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
          <div className="relative z-10 flex flex-col gap-2 sm:max-w-md">
            <label
              id="gallery-category-filter-label"
              htmlFor="gallery-category-filter"
              className="text-xs font-semibold uppercase tracking-[0.15em] text-warm-mist"
            >
              Select categories to see job pictures
            </label>
            <div className="relative">
              <button
                ref={categoryTriggerRef}
                type="button"
                id="gallery-category-filter"
                aria-haspopup="listbox"
                aria-expanded={categoryMenu.open}
                aria-controls="gallery-category-listbox"
                aria-labelledby="gallery-category-filter-label"
                onClick={() => {
                  setCategoryMenu((prev) =>
                    prev.open
                      ? { ...prev, open: false }
                      : {
                          open: true,
                          highlightIndex: selectedCategoryOptionIndex,
                        },
                  );
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    event.preventDefault();
                    setCategoryMenu((prev) => ({ ...prev, open: false }));
                    return;
                  }
                  if (
                    event.key === "ArrowDown" ||
                    event.key === "ArrowUp" ||
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    if (!categoryMenu.open && event.key !== "Escape") {
                      event.preventDefault();
                      setCategoryMenu({
                        open: true,
                        highlightIndex: selectedCategoryOptionIndex,
                      });
                    }
                  }
                }}
                className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-graphite/15 bg-stone-white px-4 py-3 text-left text-sm text-graphite outline-none transition hover:border-graphite/25 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/25"
              >
                <span className="min-w-0 truncate">{categoryTriggerLabel}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-graphite/60 transition-transform duration-200 ${categoryMenu.open ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>

              {categoryMenu.open ? (
                <div
                  ref={categoryListRef}
                  id="gallery-category-listbox"
                  role="listbox"
                  aria-labelledby="gallery-category-filter-label"
                  tabIndex={-1}
                  className="absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-auto rounded-xl border border-graphite/15 bg-stone-white py-1 shadow-lg shadow-graphite/10 outline-none ring-1 ring-black/5"
                  onKeyDown={(event) => {
                    const last = categoryOptions.length - 1;
                    if (event.key === "Escape") {
                      event.preventDefault();
                      setCategoryMenu((prev) => ({ ...prev, open: false }));
                      categoryTriggerRef.current?.focus();
                      return;
                    }
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      setCategoryMenu((prev) => ({
                        ...prev,
                        highlightIndex:
                          prev.highlightIndex >= last ? 0 : prev.highlightIndex + 1,
                      }));
                      return;
                    }
                    if (event.key === "ArrowUp") {
                      event.preventDefault();
                      setCategoryMenu((prev) => ({
                        ...prev,
                        highlightIndex:
                          prev.highlightIndex <= 0 ? last : prev.highlightIndex - 1,
                      }));
                      return;
                    }
                    if (event.key === "Home") {
                      event.preventDefault();
                      setCategoryMenu((prev) => ({ ...prev, highlightIndex: 0 }));
                      return;
                    }
                    if (event.key === "End") {
                      event.preventDefault();
                      setCategoryMenu((prev) => ({ ...prev, highlightIndex: last }));
                      return;
                    }
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      const choice =
                        categoryOptions[categoryMenu.highlightIndex];
                      if (choice) selectCategorySlug(choice.slug);
                    }
                  }}
                >
                  {categoryOptions.map((option, index) => {
                    const selected = option.slug === selectedSlug;
                    const highlighted = index === categoryMenu.highlightIndex;
                    return (
                      <div
                        key={option.slug === "" ? "__all" : option.slug}
                        role="option"
                        aria-selected={selected}
                        tabIndex={-1}
                        className={`cursor-pointer px-4 py-2.5 text-sm outline-none transition ${
                          highlighted
                            ? "bg-gold/15 text-graphite"
                            : "text-graphite hover:bg-parchment"
                        } ${selected ? "font-semibold" : "font-normal"}`}
                        onMouseEnter={() =>
                          setCategoryMenu((prev) => ({
                            ...prev,
                            highlightIndex: index,
                          }))
                        }
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => selectCategorySlug(option.slug)}
                      >
                        {option.title}
                      </div>
                    );
                  })}
                </div>
              ) : null}
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
            yet. Try another category or choose &ldquo;All Job Categories&rdquo;.
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
