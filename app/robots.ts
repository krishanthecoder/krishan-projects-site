import type { MetadataRoute } from "next";

const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "https://krishanprojects.co.uk";

export default function robots(): MetadataRoute.Robots {
  const base = websiteUrl.replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio/", "/api/"],
    },
    host: base,
    sitemap: `${base}/sitemap.xml`,
  };
}
