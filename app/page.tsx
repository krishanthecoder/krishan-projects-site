import { SectionTitle } from "@/components/ui/section-title";

export default function Home() {
  return (
    <main className="min-h-screen bg-off-white px-6 py-16 sm:px-10">
      <section className="mx-auto max-w-6xl space-y-10 rounded-2xl border border-dark-slate/10 bg-white p-8 shadow-sm sm:p-12">
        <SectionTitle
          eyebrow="Built for Endurance"
          title="High-End Construction Digital Presence"
          description="A production-ready Next.js starter with App Router, TypeScript, and a premium construction color system."
        />

        <div className="grid gap-4 text-sm sm:grid-cols-3">
          <div className="rounded-xl bg-dark-slate p-5 text-off-white">
            <p className="font-semibold">Dark Slate</p>
            <p className="mt-2 text-off-white/75">Primary brand foundation</p>
          </div>
          <div className="rounded-xl bg-industrial-orange p-5 text-off-white">
            <p className="font-semibold">Industrial Orange</p>
            <p className="mt-2 text-off-white/85">Action and emphasis</p>
          </div>
          <div className="rounded-xl border border-dark-slate/20 bg-off-white p-5 text-dark-slate">
            <p className="font-semibold">Off-White</p>
            <p className="mt-2 text-steel-gray">Clean premium backdrop</p>
          </div>
        </div>
      </section>
    </main>
  );
}
