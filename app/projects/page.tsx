import { SectionTitle } from "@/components/ui/section-title";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ProjectGallery } from "@/components/project-gallery";

export default function ProjectsPage() {
  return (
    <main id="main-content" className="min-h-screen bg-stone-white">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-20">
        <ScrollReveal>
          <SectionTitle
            eyebrow="Our Portfolio"
            title="Recent Projects"
            description="Browse photos from recent renovations, extensions, and kitchen fitting — the same projects we quote and deliver on site."
          />
        </ScrollReveal>

        <div className="mt-12">
          <ProjectGallery showHeadline={false} />
        </div>
      </div>
    </main>
  );
}
