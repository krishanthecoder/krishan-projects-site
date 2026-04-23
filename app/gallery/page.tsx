import { SectionTitle } from "@/components/ui/section-title";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ProjectGallery } from "@/components/project-gallery";

export default function GalleryPage() {
  return (
    <main id="main-content" className="min-h-screen bg-stone-white">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
        <ScrollReveal>
          <SectionTitle
            eyebrow="Our Portfolio"
            title="Recent Project Gallery"
            description="A detailed look at our recent renovations, extensions, and kitchen fitting projects."
          />
        </ScrollReveal>
        
        <div className="mt-16">
          <ProjectGallery />
        </div>
      </div>
    </main>
  );
}
