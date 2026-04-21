import { createImageUrlBuilder } from "@sanity/image-url";
import type { Image } from "sanity";

import { sanityClient } from "@/lib/sanity.client";

const imageBuilder = createImageUrlBuilder(sanityClient);

export function urlFor(source: Image) {
  return imageBuilder.image(source);
}
