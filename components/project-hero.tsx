import type { GalleryProject } from "@/lib/sanity.queries";

import { SanityImage } from "./sanity-image";

type ProjectHeroProps = {
  project: GalleryProject | null;
};

function formatGbpValue(value?: number) {
  if (typeof value !== "number") return null;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ProjectHero({ project }: ProjectHeroProps) {
  if (!project?.image) {
    return (
      <section className="rounded-2xl border border-dark-slate/10 bg-dark-slate p-8 text-off-white sm:p-12">
        <p className="text-sm uppercase tracking-[0.2em] text-industrial-orange">Featured Project</p>
        <h2 className="mt-4 text-3xl font-semibold">Showcase your best construction work here.</h2>
        <p className="mt-3 text-off-white/75">
          Add a project image in Sanity Studio and this hero will automatically update.
        </p>
      </section>
    );
  }

  const heroAlt = project.image.alt?.trim() || project.title;

  return (
    <section className="space-y-4">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-industrial-orange">
        Featured Project
      </p>
      <div className="relative h-80 overflow-hidden rounded-2xl border border-dark-slate/10">
        <SanityImage
          image={project.image}
          alt={heroAlt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 85vw"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark-slate/90 to-transparent px-6 py-5">
          <h2 className="text-2xl font-semibold text-off-white">{project.title}</h2>
          {project.projectLocation ? (
            <p className="mt-1 text-sm text-off-white/85">{project.projectLocation}</p>
          ) : null}
          {project.projectValue ? (
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-off-white/75">
              Project Value: {formatGbpValue(project.projectValue)}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
