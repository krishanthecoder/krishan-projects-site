"use client";

import Image from "next/image";
import { useNextSanityImage } from "next-sanity-image";
import type { CSSProperties } from "react";
import type { Image as SanityImageAsset } from "sanity";

import { objectPositionFromHotspot } from "@/lib/image-hotspot";
import { sanityClient } from "@/lib/sanity.client";
import type { SanityImage as CmsImage } from "@/lib/sanity.queries";
import { urlFor } from "@/src/sanity/lib/imageHelpers";

type SanityImageProps = {
  /** CMS image from GROQ — crop/hotspot fields may be partial. */
  image: CmsImage;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  fill?: boolean;
  width?: number;
  height?: number;
  style?: CSSProperties;
};

export function SanityImage({
  image,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  quality = 80,
  fill = false,
  width,
  height,
  style,
}: SanityImageProps) {
  // next-sanity-image expects Sanity's Image type; our CMS shape is compatible at runtime.
  const imageSource = image as SanityImageAsset;
  const imageProps = useNextSanityImage(sanityClient, imageSource, {
    imageBuilder: (builder, options) => {
      const withQuality = builder.quality(quality).auto("format");
      return options.width ? withQuality.width(options.width) : withQuality;
    },
  });

  if (!imageProps) {
    return null;
  }

  const blurDataURL = (() => {
    const source = image as {
      asset?: {
        metadata?: {
          lqip?: string;
        };
      };
    };
    return source.asset?.metadata?.lqip;
  })();

  const placeholder = blurDataURL ? "blur" : "empty";
  const objectPosition = objectPositionFromHotspot(image.hotspot);
  const mergedStyle: CSSProperties = {
    ...(objectPosition ? { objectPosition } : {}),
    ...style,
  };

  if (fill) {
    return (
      <Image
        src={imageProps.src}
        loader={imageProps.loader}
        alt={alt}
        fill
        sizes={sizes}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        priority={priority}
        className={className}
        style={mergedStyle}
      />
    );
  }

  return (
    <Image
      src={
        imageProps.src ||
        urlFor(imageSource)
          .width(width ?? 1200)
          .quality(quality)
          .auto("format")
          .url()
      }
      loader={imageProps.loader}
      alt={alt}
      width={width ?? imageProps.width}
      height={height ?? imageProps.height}
      sizes={sizes}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      priority={priority}
      className={className}
      style={mergedStyle}
    />
  );
}
