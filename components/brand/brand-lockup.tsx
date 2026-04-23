import { BrandMark } from "@/components/brand/brand-mark";

type BrandLockupProps = {
  compact?: boolean;
  className?: string;
};

export function BrandLockup({
  compact = false,
  className = "",
}: BrandLockupProps) {
  const markSize = compact ? 38 : 46;
  const textClassName = compact
    ? "text-sm sm:text-base tracking-[0.12em]"
    : "text-base sm:text-[1.12rem] tracking-[0.14em]";

  return (
    <div className={`flex items-center gap-2.5 ${className}`.trim()}>
      <div className="shrink-0">
        <BrandMark size={markSize} />
      </div>
      <p
        className={`min-w-0 whitespace-nowrap font-semibold leading-none text-graphite ${textClassName}`.trim()}
      >
        Krishan Projects
      </p>
    </div>
  );
}
