import { BrandMark } from "@/components/brand/brand-mark";

type BrandLockupProps = {
  compact?: boolean;
  className?: string;
};

export function BrandLockup({
  compact = false,
  className = "",
}: BrandLockupProps) {
  const markSize = compact ? 44 : 52;
  const textClassName = compact
    ? "text-sm sm:text-base"
    : "text-base sm:text-[1.1rem]";

  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      <div className="shrink-0">
        <BrandMark size={markSize} animated />
      </div>
      <p
        className={`min-w-0 font-semibold tracking-[0.06em] text-graphite ${textClassName}`.trim()}
      >
        Krishan Projects
      </p>
    </div>
  );
}
