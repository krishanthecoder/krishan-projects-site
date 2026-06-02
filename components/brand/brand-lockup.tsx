import {
  brandLockupDimensions,
  getBrandLogoSources,
  type BrandLogoVariant,
} from "@/lib/brand-assets";

type BrandLockupProps = {
  /** `default` = navbar (light bg). `inverted` = footer (dark bg). */
  variant?: BrandLogoVariant;
  compact?: boolean;
  className?: string;
  alt?: string;
};

export function BrandLockup({
  variant = "default",
  compact = false,
  className = "",
  alt = "Krishan Projects",
}: BrandLockupProps) {
  const { svg, png } = getBrandLogoSources(variant);
  const sizes = compact
    ? "(max-width: 360px) 118px, (max-width: 640px) 140px, 170px"
    : "(max-width: 640px) 140px, 170px";
  const classNames = compact
    ? "h-8 w-auto min-[360px]:h-9 sm:h-[42px]"
    : "h-10 w-auto sm:h-11";

  return (
    <div className={`flex items-center ${className}`.trim()}>
      <picture>
        <source srcSet={svg} type="image/svg+xml" />
        <img
          src={png}
          alt={alt}
          width={brandLockupDimensions.width}
          height={brandLockupDimensions.height}
          sizes={sizes}
          className={`${classNames} block object-contain`}
          loading="eager"
          decoding="async"
        />
      </picture>
    </div>
  );
}
