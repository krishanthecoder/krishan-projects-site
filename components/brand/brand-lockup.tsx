import Image from "next/image";

type BrandLockupProps = {
  compact?: boolean;
  className?: string;
  variant?: "default" | "inverted";
};

export function BrandLockup({
  compact = false,
  className = "",
  variant = "default",
}: BrandLockupProps) {
  const sizes = compact
    ? "(max-width: 360px) 118px, (max-width: 640px) 140px, 170px"
    : "(max-width: 640px) 140px, 170px";
  const classNames = compact
    ? "h-8 w-auto min-[360px]:h-9 sm:h-[42px]"
    : "h-10 w-auto sm:h-11";
  const src =
    variant === "inverted"
      ? "/brand/navbar-logo-v3-inverted.png"
      : "/brand/navbar-logo-v3-tweaked.png";

  return (
    <div className={`flex items-center ${className}`.trim()}>
      <Image
        src={src}
        alt="Krishan Projects"
        width={1161}
        height={335}
        sizes={sizes}
        className={`${classNames} block object-contain`}
        unoptimized
      />
    </div>
  );
}
