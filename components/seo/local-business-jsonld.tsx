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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: businessName,
    telephone: phoneNumber,
    areaServed: serviceArea,
    url: websiteUrl,
    image: `${websiteUrl}/window.svg`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
