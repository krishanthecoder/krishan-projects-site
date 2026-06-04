export function ServicesHeroGridPattern() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.07]"
      style={{
        backgroundImage: `
          linear-gradient(to right, #C4973D 1px, transparent 1px),
          linear-gradient(to bottom, #C4973D 1px, transparent 1px)
        `,
        backgroundSize: "28px 28px",
      }}
      aria-hidden
    />
  );
}
