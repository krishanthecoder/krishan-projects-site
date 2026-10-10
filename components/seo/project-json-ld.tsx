export type ProjectVideoJsonLd = {
  name: string;
  description: string;
  contentUrl: string;
  thumbnailUrl: string;
  uploadDate: string;
};

type ProjectJsonLdProps = {
  canonicalUrl: string;
  siteUrl: string;
  businessName: string;
  title: string;
  description: string;
  heroImageUrl?: string;
  videos?: ProjectVideoJsonLd[];
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
  videos = [],
}: ProjectJsonLdProps) {
  const videoObjects = videos.map((video, index) => ({
    "@type": "VideoObject",
    "@id": `${canonicalUrl}#video-${index + 1}`,
    name: video.name,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
    contentUrl: video.contentUrl,
  }));
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
      ...(videoObjects.length > 0
        ? {
            video: videoObjects.length === 1 ? videoObjects[0] : videoObjects,
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
