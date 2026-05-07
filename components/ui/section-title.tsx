type SectionTitleProps = {
  /** Render as h1 for the primary page title, h2 for section headings (default). */
  as?: "h1" | "h2";
  /** Forwarded to the heading element — useful for aria-labelledby targets. */
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionTitle({ as: Tag = "h2", id, eyebrow, title, description }: SectionTitleProps) {
  return (
    <div className="space-y-4">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          {eyebrow}
        </p>
      ) : null}
      <Tag id={id} className="text-3xl font-bold leading-tight tracking-tight text-graphite sm:text-5xl lg:text-6xl">
        {title}
      </Tag>
      {description ? (
        <p className="max-w-2xl text-sm leading-relaxed text-graphite/85 sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
