import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Link from "next/link";

import { BrandLockup } from "@/components/brand/brand-lockup";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME ?? "Krishan Projects";
const serviceAreas = (process.env.NEXT_PUBLIC_BUSINESS_SERVICE_AREAS ?? "South Ockendon, Grays, London")
  .split(",")
  .map((area) => area.trim())
  .filter(Boolean);
const primaryArea = serviceAreas[0] ?? "London";
const serviceAreasLabel = serviceAreas.join(", ");
const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "https://krishanprojects.co.uk";
const phoneNumber = process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "07572138829";
const phoneHref = `tel:${phoneNumber.replace(/\s/g, "")}`;

export const metadata: Metadata = {
  metadataBase: new URL(websiteUrl),
  title: {
    default: `${businessName} | Builders in ${primaryArea}`,
    template: `%s | ${businessName}`,
  },
  description:
    `${businessName} provides trusted construction and renovation services across ${serviceAreasLabel}.`,
  keywords: [
    "construction",
    "home renovation",
    "local builder",
    "tradesman",
    primaryArea,
    ...serviceAreas,
  ],
  openGraph: {
    title: `${businessName} | Builders in ${primaryArea}`,
    description: `${businessName} serves ${serviceAreasLabel} for kitchen, bathroom, loft, and full-home renovation projects.`,
    url: websiteUrl,
    siteName: businessName,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${businessName} | ${primaryArea}`,
    description: `${businessName} serves ${serviceAreasLabel}.`,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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

        {/* ── Site header ── */}
        <header className="sticky top-0 z-40 border-b border-graphite/8 bg-stone-white/95 backdrop-blur-sm">
          <div className="relative mx-auto flex h-16 max-w-6xl items-center px-6 sm:px-10">

            {/* Logo — left */}
            <Link href="/" aria-label={`${businessName} home`} className="shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
              <BrandLockup compact />
            </Link>

            {/* Nav links — absolutely centred so they're always in the true middle
                regardless of logo/CTA widths */}
            <nav
              className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex"
              aria-label="Main navigation"
            >
              {(["Home", "Services", "Projects", "Contact"] as const).map((label) => {
                const href = label === "Home" ? "/" : `#${label.toLowerCase()}`;
                return (
                  <a
                    key={label}
                    href={href}
                    className="text-sm font-medium text-warm-mist transition-colors hover:text-graphite focus-visible:outline-none focus-visible:underline"
                  >
                    {label}
                  </a>
                );
              })}
            </nav>

            {/* Right: phone number + CTA */}
            <div className="ml-auto flex shrink-0 items-center gap-3">
              <a
                href={phoneHref}
                className="hidden text-sm font-medium text-graphite transition-colors hover:text-gold lg:block"
              >
                Call {phoneNumber}
              </a>
              <a
                href="#contact"
                className="rounded-full bg-graphite px-4 py-2 text-sm font-semibold text-stone-white shadow-sm transition-colors hover:bg-graphite/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              >
                <span className="hidden sm:inline">Request a Call Back</span>
                <span className="sm:hidden">Call Back</span>
              </a>
            </div>

          </div>
        </header>

        {children}

        {/* ── Site footer ── */}
        <footer className="border-t border-graphite/10 bg-parchment px-6 py-12 sm:px-10">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <BrandLockup compact />
              <p className="text-sm text-warm-mist">Serving {serviceAreasLabel}</p>
              <a
                href={phoneHref}
                className="text-sm font-medium text-gold transition-colors hover:text-gold/75 focus-visible:outline-none focus-visible:underline"
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
