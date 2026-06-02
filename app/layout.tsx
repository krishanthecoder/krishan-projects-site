import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { RouteScrollReset } from "@/components/route-scroll-reset";
import { brandEmblem } from "@/lib/brand-assets";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME ?? "Krishan Projects";
const serviceAreas = (process.env.NEXT_PUBLIC_BUSINESS_SERVICE_AREAS ?? "London, South Ockendon, Grays")
  .split(",")
  .map((area) => area.trim())
  .filter(Boolean);
const primaryArea = serviceAreas[0] ?? "London";
const serviceAreasLabel = serviceAreas.join(", ");
const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "https://krishanprojects.co.uk";

export const metadata: Metadata = {
  metadataBase: new URL(websiteUrl),
  title: {
    default: `${businessName} | Builders and Kitchen Fitters in ${primaryArea}`,
    template: `%s | ${businessName}`,
  },
  description:
    `${businessName} is a small ${primaryArea} building team. Home renovations, kitchen fitting, extensions and general building works across ${serviceAreasLabel} — tidy sites, honest quotes, and realistic timelines we actually stick to.`,
  keywords: [
    "local builder",
    "small building team",
    "tradesman",
    "home renovation",
    "kitchen fitter",
    "kitchen fitting london",
    "house extensions",
    "loft conversion",
    "free quote",
    "trusted builder",
    primaryArea,
    ...serviceAreas,
  ],
  openGraph: {
    title: `${businessName} | Builders and Kitchen Fitters in ${primaryArea}`,
    description: `A small ${primaryArea} team of builders and fitters covering ${serviceAreasLabel}. Tidy sites, clear quotes, realistic timelines.`,
    url: websiteUrl,
    siteName: businessName,
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${businessName} | Builders in ${primaryArea}`,
    description: `A small ${primaryArea} team covering ${serviceAreasLabel} — renovations, kitchen fitting and extensions.`,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      {
        url: `${brandEmblem.png}?v=1`,
        type: "image/png",
        sizes: "512x512",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full bg-stone-white text-graphite">
        <RouteScrollReset />
        {children}
      </body>
    </html>
  );
}
