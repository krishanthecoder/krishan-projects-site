import type { Image } from "sanity";

import { urlFor } from "@/src/sanity/lib/imageHelpers";

/**
 * Lightbox fits max-w-5xl (~1024px CSS). 1280 covers retina without heavy files.
 * WebP avoids progressive-JPEG “top to bottom” scan painting.
 */
export const LIGHTBOX_IMAGE_WIDTH = 1280;

const prefetchedUrls = new Set<string>();

export function lightboxImageUrl(image: Image) {
  return urlFor(image)
    .width(LIGHTBOX_IMAGE_WIDTH)
    .quality(70)
    .format("webp")
    .fit("max")
    .url();
}

/** Warm the browser cache for lightbox-sized assets (hover / adjacent slides). */
export function prefetchLightboxImage(image: Image | null | undefined) {
  if (!image || typeof window === "undefined") return;
  try {
    const url = lightboxImageUrl(image);
    if (!url || prefetchedUrls.has(url)) return;
    prefetchedUrls.add(url);
    const img = new window.Image();
    img.decoding = "async";
    img.src = url;
    void img.decode().catch(() => {
      // decode() can reject for aborted/cached edge cases — src still warms cache.
    });
  } catch {
    // Ignore invalid/missing assets during prefetch.
  }
}
