import Image from "next/image";

type BrandLockupProps = {
  compact?: boolean;
  className?: string;
};

export function BrandLockup({
  compact = false,
  className = "",
}: BrandLockupProps) {
  // We use a tightly cropped transparent PNG of the tweaked Version 2 crest logo.
  const height = compact ? 32 : 44;

  return (
    <div className={`flex items-center ${className}`.trim()}>
      <Image
        src="/brand/navbar-logo-v3-tweaked.png"
        alt="Krishan Projects"
        width={1161}
        height={335}
        sizes={compact ? "110px" : "166px"}
        style={{ height: `${height}px`, width: "auto" }}
        className="block object-contain"
        priority
        loading="eager"
        fetchPriority="high"
      />
    </div>
  );
}
