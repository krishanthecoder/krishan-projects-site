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
      "A small London building team offering home renovations, kitchen fitting, extensions and general building works with tidy sites, honest quotes and realistic timelines.",
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
      "Kitchen fitting in London",
      "Home renovation",
      "House extensions",
      "General building works",
      "Bathroom renovation",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
