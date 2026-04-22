type LocalBusinessJsonLdProps = {
  businessName: string;
  serviceArea: string[];
  phoneNumber: string;
  websiteUrl: string;
};

export function LocalBusinessJsonLd({
  businessName,
  serviceArea,
  phoneNumber,
  websiteUrl,
}: LocalBusinessJsonLdProps) {
  const normalizedWebsiteUrl = websiteUrl.replace(/\/$/, "");
  const normalizedServiceAreas = Array.from(
    new Set(
      serviceArea
        .map((area) => area.trim())
        .filter(Boolean),
    ),
  );
  const areaServed = normalizedServiceAreas.length > 0
    ? normalizedServiceAreas
    : ["London and surrounding areas"];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": `${normalizedWebsiteUrl}/#localbusiness`,
    name: businessName,
    description:
      "Premium home renovations, kitchen fitting, extensions, and building works in London with a focus on quality, cleanliness, and fixed timelines.",
    telephone: phoneNumber,
    areaServed: areaServed.map((area) => ({
      "@type": "City",
      name: area,
    })),
    url: normalizedWebsiteUrl,
    image: `${normalizedWebsiteUrl}/window.svg`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "London",
      addressCountry: "GB",
    },
    knowsAbout: [
      "Premium kitchen fitting in London",
      "Home renovation",
      "House extensions",
      "Fixed-price building works",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
