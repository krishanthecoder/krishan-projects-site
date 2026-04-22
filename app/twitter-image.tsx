import { ImageResponse } from "next/og";

import { SocialCard } from "@/components/brand/social-card";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME ?? "Krishan Projects";
const serviceAreas = (process.env.NEXT_PUBLIC_BUSINESS_SERVICE_AREAS ??
  "London, South Ockendon, Grays")
  .split(",")
  .map((area) => area.trim())
  .filter(Boolean);

export default function TwitterImage() {
  const primaryArea = serviceAreas[0] ?? "London";

  return new ImageResponse(
    (
      <SocialCard
        eyebrow={businessName}
        location={primaryArea}
        title="Builders for High-End Home Upgrades"
        subtitle="Craft-led renovations, extensions, and premium kitchen fitting presented with a clean, modern brand system."
      />
    ),
    size,
  );
}
