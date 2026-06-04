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
    <div className="flex flex-col gap-5 rounded-3xl border border-gold/35 bg-stone-white/82 p-5 shadow-2xl backdrop-blur-md ring-1 ring-gold/15 sm:p-6">
      {/* Verified Reviews Section */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-graphite/70">
          Verified Reviews
        </p>
        <div className="mt-2.5 flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className="text-base leading-none text-[#C4973D]"
              aria-hidden="true"
            >
              ★
            </span>
          ))}
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-graphite">
            4.9
          </span>
          <span className="text-xl font-semibold text-graphite/45">/ 5</span>
        </div>
        <p className="mt-1 text-xs font-semibold text-graphite/65">
          12 reviews on Checkatrade & Google
        </p>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-graphite/5" aria-hidden="true" />

      {/* Accreditations Section */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-graphite/70">
          Accreditations
        </p>
        <div className="mt-3.5 flex flex-wrap gap-2">
          {accreditations.map((item) => (
            <span
              key={item}
              className="rounded-lg border border-graphite/15 bg-stone-white px-3.5 py-1.5 text-[10px] font-bold text-graphite/85 shadow-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
