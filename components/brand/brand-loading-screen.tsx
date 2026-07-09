import { brandEmblem } from "@/lib/brand-assets";

type BrandLoadingScreenProps = {
  /** Screen reader only — no visible label is shown. */
  ariaLabel?: string;
  hint?: string;
  /** `fullscreen` covers the viewport (site route transitions). `embedded` fills its parent (Studio). */
  variant?: "fullscreen" | "embedded";
  className?: string;
};

const quadrantClass =
  "brand-loading-emblem__quad absolute inset-0 h-full w-full object-contain pointer-events-none";

export function BrandLoadingScreen({
  ariaLabel = "Loading",
  hint,
  variant = "embedded",
  className = "",
}: BrandLoadingScreenProps) {
  const rootClass =
    variant === "fullscreen"
      ? "fixed inset-0 z-[200] flex items-center justify-center bg-stone-white"
      : "flex h-full min-h-0 flex-1 items-center justify-center bg-stone-white";

  return (
    <div
      aria-busy="true"
      aria-label={ariaLabel}
      className={`${rootClass} ${className}`.trim()}
    >
      <div className="flex flex-col items-center px-6 text-center">
        <figure className="brand-loading-emblem" role="status" aria-live="polite">
          <div className="brand-loading-emblem__visual">
            <img
              src={brandEmblem.png}
              alt=""
              width={96}
              height={96}
              className={`${quadrantClass} brand-loading-emblem__quad--tl`}
              aria-hidden
            />
            <img
              src={brandEmblem.png}
              alt=""
              width={96}
              height={96}
              className={`${quadrantClass} brand-loading-emblem__quad--tr`}
              aria-hidden
            />
            <img
              src={brandEmblem.png}
              alt=""
              width={96}
              height={96}
              className={`${quadrantClass} brand-loading-emblem__quad--bl`}
              aria-hidden
            />
            <img
              src={brandEmblem.png}
              alt=""
              width={96}
              height={96}
              className={`${quadrantClass} brand-loading-emblem__quad--br`}
              aria-hidden
            />
          </div>
        </figure>

        {hint ? (
          <p className="mt-8 max-w-sm text-xs leading-relaxed text-warm-mist">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}
