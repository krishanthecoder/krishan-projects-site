type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <div className="space-y-3">
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-industrial-orange">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-4xl font-bold tracking-tight text-dark-slate sm:text-5xl">
        {title}
      </h1>
      {description ? (
        <p className="max-w-2xl text-base text-steel-gray sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
