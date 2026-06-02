import { pageHeroSectionClass } from "@/lib/page-hero";

export default function ContactLoading() {
  return (
    <main id="main-content" className="min-h-screen bg-stone-white">
      <div
        className={`${pageHeroSectionClass} left-1/2 w-screen max-w-[100vw] -translate-x-1/2`}
        aria-hidden
      >
        <div className="absolute inset-0 bg-graphite/80" />
        <div className="relative z-[2] mx-auto max-w-6xl animate-pulse space-y-3 px-6 sm:px-10">
          <div className="h-3 w-28 rounded bg-stone-white/20" />
          <div className="h-10 w-72 max-w-full rounded bg-stone-white/25" />
          <div className="h-4 w-full max-w-lg rounded bg-stone-white/15" />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-12 sm:px-10">
        <div className="animate-pulse rounded-3xl border border-graphite/10 bg-parchment/60 p-8 sm:p-10">
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-11 rounded-xl bg-warm-mist/35" />
            ))}
            <div className="h-12 rounded-xl bg-warm-mist/50" />
          </div>
        </div>
      </div>
    </main>
  );
}
