import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";

import { BrandLockup } from "@/components/brand/brand-lockup";
import { MainNav } from "@/components/main-nav";
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
const phoneNumber = process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "07572138829";

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

            <div className="flex items-center gap-8">
              <MainNav />

              <a
                href={`tel:${phoneNumber.replace(/\s/g, "")}`}
                className="shrink-0 rounded-xl bg-gold px-4 py-2 text-sm font-bold text-stone-white shadow-sm transition-all hover:bg-gold/90 active:scale-95 active:bg-gold/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                aria-label={`Call us at ${phoneNumber}`}
              >
                {phoneNumber}
              </a>
            </div>
          </div>
        </header>

        {children}

        {/* ── Site footer ── */}
        <footer className="border-t border-graphite/10 bg-parchment px-6 py-12 sm:px-10">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-3">
                <Link
                  href="/"
                  className="transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                  aria-label={`${businessName} home`}
                >
                  <BrandLockup compact />
                </Link>
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
