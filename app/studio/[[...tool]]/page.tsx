"use client";

import dynamic from "next/dynamic";

import { createStudioConfig } from "@/sanity/studioConfig";

const studioConfig = createStudioConfig();

const NextStudio = dynamic(
  () => import("next-sanity/studio").then((mod) => mod.NextStudio),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-0 flex-1 items-center justify-center bg-stone-white">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-stone-300 border-t-stone-800" />
      </div>
    ),
  },
);

export default function StudioPage() {
  if (!studioConfig) {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl items-center px-6 py-20">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950 shadow-sm">
          <h1 className="text-xl font-semibold">Studio is not configured yet</h1>
          <p className="mt-3 text-sm leading-relaxed">
            Add <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> (and optionally{" "}
            <code>NEXT_PUBLIC_SANITY_DATASET</code>) to <code>.env.local</code>, then restart
            the dev server.
          </p>
        </div>
      </main>
    );
  }

  return <NextStudio config={studioConfig} />;
}
