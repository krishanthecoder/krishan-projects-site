"use client";

import Image from "next/image";
import { useNextSanityImage } from "next-sanity-image";
import type { Image as SanityImageAsset } from "sanity";

import { sanityClient } from "@/lib/sanity.client";
import { urlFor } from "@/src/sanity/lib/imageHelpers";

type SanityImageProps = {
  image: SanityImageAsset;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  fill?: boolean;
  width?: number;
  height?: number;
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
}: SanityImageProps) {
  const imageProps = useNextSanityImage(sanityClient, image, {
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
      />
    );
  }

  return (
    <Image
      src={imageProps.src || urlFor(image).width(width ?? 1200).quality(quality).auto("format").url()}
      loader={imageProps.loader}
      alt={alt}
      width={width ?? imageProps.width}
      height={height ?? imageProps.height}
      sizes={sizes}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      priority={priority}
      className={className}
    />
  );
}
