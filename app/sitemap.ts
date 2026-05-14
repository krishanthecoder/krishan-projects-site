import type { MetadataRoute } from "next";

import { getProjectSitemapEntries } from "@/lib/sanity.queries";

const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "https://krishanprojects.co.uk";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = websiteUrl.replace(/\/$/, "");

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/services`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${base}/gallery`, changeFrequency: "weekly", priority: 0.85 },
  ];

  const projects = await getProjectSitemapEntries();
  const projectEntries: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified: p._updatedAt ? new Date(p._updatedAt) : undefined,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticEntries, ...projectEntries];
}
