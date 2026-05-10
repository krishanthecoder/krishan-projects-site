import { SectionTitle } from "@/components/ui/section-title";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ProjectGallery } from "@/components/project-gallery";

export default function GalleryPage() {
  return (
    <main id="main-content" className="min-h-screen bg-stone-white">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-20">
        <ScrollReveal>
          <SectionTitle
            eyebrow="Our Portfolio"
            title="Recent Project Gallery"
            description="Photos from recent renovations, extensions, and kitchen fitting — real finishes and tidy sites, not stock imagery."
          />
        </ScrollReveal>

        <div className="mt-12">
          <ProjectGallery showHeadline={false} />
        </div>
      </div>
    </main>
  );
}
