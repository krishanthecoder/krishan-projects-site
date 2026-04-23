import { ScrollReveal } from "./ui/scroll-reveal";

export function TrustCards() {
  const accreditations = [
    "£2m public liability insurance",
    "CSCS Card",
    "NVQ Level 2 GroundWorks",
    "SSSTS Supervision",
    "CPCS A40 All Duties Slinger Signaller",
    "Certified Bricklayer",
  ];

  return (
    <ScrollReveal delay={0.2}>
      <div className="flex flex-col gap-6 rounded-3xl border border-gold/20 bg-stone-white/40 p-6 shadow-xl backdrop-blur-md ring-1 ring-white/20 sm:p-8">
        {/* Verified Reviews Section */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-warm-mist/80">
            Verified Reviews
          </p>
          <div className="mt-4 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className="text-lg leading-none text-[#C4973D]"
                aria-hidden="true"
              >
                ★
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight text-graphite">
              4.9
            </span>
            <span className="text-2xl font-medium text-graphite/40">/ 5</span>
          </div>
          <p className="mt-2 text-sm font-medium text-warm-mist">
            12 reviews on Checkatrade & Google
          </p>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-graphite/5" aria-hidden="true" />

        {/* Accreditations Section */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-warm-mist/80">
            Accreditations
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {accreditations.map((item) => (
              <span
                key={item}
                className="rounded-xl border border-graphite/10 bg-stone-white/80 px-3 py-1.5 text-[11px] font-bold text-graphite/80 shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
