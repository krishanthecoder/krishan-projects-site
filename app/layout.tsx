import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";

import { BrandLockup } from "@/components/brand/brand-lockup";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME ?? "Krishan Projects";
const serviceAreas = (process.env.NEXT_PUBLIC_BUSINESS_SERVICE_AREAS ?? "London, South Ockendon, Grays")
  .split(",")
  .map((area) => area.trim())
  .filter(Boolean);
const primaryArea = serviceAreas[0] ?? "London";
const serviceAreasLabel = serviceAreas.join(", ");
const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "https://krishanprojects.co.uk";
const phoneNumber = process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "07572138829";

export const metadata: Metadata = {
  metadataBase: new URL(websiteUrl),
  title: {
    default: `${businessName} | Home Renovations and Kitchen Fitting in ${primaryArea}`,
    template: `%s | ${businessName}`,
  },
  description:
    `${businessName} delivers premium home renovations, kitchen fitting, extensions, and building works across ${serviceAreasLabel} with quality finishes, clean sites, and fixed timelines.`,
  keywords: [
    "construction",
    "home renovation",
    "kitchen fitting",
    "kitchen fitting london",
    "premium kitchen fitting london",
    "house extensions",
    "fixed-price quote",
    "local builder",
    "tradesman",
    primaryArea,
    ...serviceAreas,
  ],
  openGraph: {
    title: `${businessName} | Home Renovations and Kitchen Fitting in ${primaryArea}`,
    description: `${businessName} serves ${serviceAreasLabel} for premium home renovations, kitchen fitting, and extensions delivered with fixed timelines and a clean finish.`,
    url: websiteUrl,
    siteName: businessName,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${businessName} | Renovations in ${primaryArea}`,
    description: `Premium home renovations, kitchen fitting, and extensions across ${serviceAreasLabel}.`,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-stone-white text-graphite">
        {/* Skip link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-stone-white focus:px-3 focus:py-2 focus:text-graphite focus:shadow-md focus:outline-none focus:ring-2 focus:ring-gold"
        >
          Skip to main content
        </a>

        {/* ── Sticky site header ── */}
        <header className="sticky top-0 z-40 border-b border-graphite/8 bg-stone-white/95 backdrop-blur-sm">
          <div className="mx-auto flex min-h-20 max-w-6xl items-center justify-between gap-4 px-6 py-3 sm:px-10">
            <Link
              href="/"
              className="transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              aria-label={`${businessName} home`}
            >
              <BrandLockup />
            </Link>
            <a
              href={`tel:${phoneNumber.replace(/\s/g, "")}`}
              className="shrink-0 rounded-xl px-4 py-2 text-sm font-semibold text-gold ring-1 ring-gold/40 transition-colors hover:bg-gold/8 hover:ring-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-label={`Call us at ${phoneNumber}`}
            >
              {phoneNumber}
            </a>
          </div>
        </header>

        {children}

        {/* ── Site footer ── */}
        <footer className="border-t border-graphite/10 bg-parchment px-6 py-12 sm:px-10">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-3">
                <BrandLockup compact />
                <p className="text-sm text-warm-mist">Serving {serviceAreasLabel}</p>
              </div>
              <a
                href={`tel:${phoneNumber.replace(/\s/g, "")}`}
                className="text-sm font-semibold text-gold transition-colors hover:text-gold/75 focus-visible:outline-none focus-visible:underline"
              >
                {phoneNumber}
              </a>
            </div>
            <p className="mt-6 text-xs text-warm-mist/70">
              &copy; {new Date().getFullYear()} {businessName}. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
