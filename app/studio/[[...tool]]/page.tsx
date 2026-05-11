"use client";

import { NextStudio } from "next-sanity/studio";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { schemas } from "@/sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

const studioConfig =
  projectId &&
  defineConfig({
    name: "default",
    title: "Krishan Construction CMS",
    basePath: "/studio",
    projectId,
    dataset,
    /** Keep in sync with sanity.config.ts (embedded Studio used this file only). */
    releases: {
      enabled: false,
    },
    plugins: [structureTool()],
    schema: {
      types: schemas,
    },
  });

export default function StudioPage() {
  if (!studioConfig) {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl items-center px-6 py-20">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950 shadow-sm">
          <h1 className="text-xl font-semibold">Studio is not configured yet</h1>
          <p className="mt-3 text-sm leading-relaxed">
            Add <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> (and optionally <code>NEXT_PUBLIC_SANITY_DATASET</code>)
            to <code>.env.local</code>, then restart the dev server.
          </p>
        </div>
      </main>
    );
  }

  return <NextStudio config={studioConfig} />;
}
