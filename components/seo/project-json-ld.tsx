type ProjectJsonLdProps = {
  canonicalUrl: string;
  siteUrl: string;
  businessName: string;
  title: string;
  description: string;
  heroImageUrl?: string;
};

/**
 * BreadcrumbList + WebPage JSON-LD for project detail URLs.
 */
export function ProjectJsonLd({
  canonicalUrl,
  siteUrl,
  businessName,
  title,
  description,
  heroImageUrl,
}: ProjectJsonLdProps) {
  const graph: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${canonicalUrl}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${siteUrl}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Recent projects",
          item: `${siteUrl}/projects`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: title,
          item: canonicalUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: title,
      description,
      isPartOf: {
        "@type": "WebSite",
        name: businessName,
        url: `${siteUrl}/`,
      },
      ...(heroImageUrl
        ? {
            primaryImageOfPage: {
              "@type": "ImageObject",
              url: heroImageUrl,
            },
          }
        : {}),
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
