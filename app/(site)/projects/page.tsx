import { ProjectGallery } from "@/components/project-gallery";
import { ScrollReveal, ScrollRevealGroup } from "@/components/ui/scroll-reveal";
import { SectionTitle } from "@/components/ui/section-title";
import { getGalleryFilterData } from "@/lib/sanity.queries";

export default async function ProjectsPage() {
  const initialData = await getGalleryFilterData();

  return (
    <main id="main-content" className="min-h-screen bg-stone-white">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-20">
        <ScrollRevealGroup>
          <ScrollReveal>
            <SectionTitle
              eyebrow="Our Portfolio"
              title="Recent Projects"
              description="Browse photos from recent renovations, extensions, and kitchen fitting — the same projects we quote and deliver on site."
            />
          </ScrollReveal>

          <ScrollReveal className="mt-12">
            <ProjectGallery showHeadline={false} initialData={initialData} />
          </ScrollReveal>
        </ScrollRevealGroup>
      </div>
    </main>
  );
}
