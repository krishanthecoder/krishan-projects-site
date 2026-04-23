import Image from "next/image";

type BrandLockupProps = {
  compact?: boolean;
  className?: string;
};

export function BrandLockup({
  compact = false,
  className = "",
}: BrandLockupProps) {
  // We use a tightly cropped transparent PNG to preserve the
  // high-fidelity skeuomorphic detail without a visible background box.
  const height = compact ? 36 : 56;

  return (
    <div className={`flex items-center ${className}`.trim()}>
      <Image
        src="/brand/navbar-logo-transparent.png"
        alt="Krishan Projects"
        width={1188}
        height={394}
        sizes={compact ? "108px" : "168px"}
        style={{ height: `${height}px`, width: "auto" }}
        className="block object-contain"
        priority
      />
    </div>
  );
}
