import Image from "next/image";

type BrandLockupProps = {
  compact?: boolean;
  className?: string;
};

export function BrandLockup({
  compact = false,
  className = "",
}: BrandLockupProps) {
  const sizes = compact
    ? "(max-width: 360px) 118px, (max-width: 640px) 140px, 170px"
    : "(max-width: 640px) 140px, 170px";
  const classNames = compact
    ? "h-8 w-auto min-[360px]:h-9 sm:h-[42px]"
    : "h-10 w-auto sm:h-11";

  return (
    <div className={`flex items-center ${className}`.trim()}>
      <Image
        src="/brand/navbar-logo-v3-tweaked.png"
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
