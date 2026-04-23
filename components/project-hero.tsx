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

function formatProjectScope(services: string[] = []) {
  const cleanedServices = services
    .map((service) => service.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (cleanedServices.length === 0) return "home renovation";
  if (cleanedServices.length === 1) return cleanedServices[0];
  return `${cleanedServices[0]} and ${cleanedServices[1]}`;
}

export function ProjectHero({ project }: ProjectHeroProps) {
  if (!project?.image) {
    return (
      <section className="rounded-3xl border border-graphite/10 bg-graphite p-10 text-stone-white sm:p-14">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          From a recent job
        </p>
        <h2 className="mt-4 max-w-lg text-3xl font-bold leading-snug tracking-tight sm:text-4xl">
          A look inside the work we do.
        </h2>
        <p className="mt-3 max-w-sm text-base leading-relaxed text-stone-white/60">
          Add a project image in Sanity Studio and this panel will pull in automatically.
        </p>
      </section>
    );
  }

  const heroAlt =
    project.image.alt?.trim() ||
    `${formatProjectScope(project.services)} project by ${project.title}${project.projectLocation ? ` in ${project.projectLocation}` : " in London"}`;

  return (
    <section className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
        From a recent job
      </p>
      <div className="relative h-96 overflow-hidden rounded-3xl border border-graphite/10 shadow-md sm:h-[28rem]">
        <SanityImage
          image={project.image}
          alt={heroAlt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 85vw"
          className="object-cover transition-transform duration-700 hover:scale-[1.02]"
        />
        {/* Bottom gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-graphite/85 via-graphite/30 to-transparent px-8 py-7">
          <h2 className="text-2xl font-bold tracking-tight text-stone-white sm:text-3xl">
            {project.title}
          </h2>
          {project.projectLocation ? (
            <p className="mt-1 text-sm text-stone-white/75">{project.projectLocation}</p>
          ) : null}
          {project.projectValue ? (
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 px-3 py-1 text-xs font-semibold text-gold backdrop-blur-sm">
              {formatGbpValue(project.projectValue)}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
