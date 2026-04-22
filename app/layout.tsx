import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
const serviceAreas = (process.env.NEXT_PUBLIC_BUSINESS_SERVICE_AREAS ?? "South Ockendon, Grays, London")
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
  robots: {
    index: true,
    follow: true,
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
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-off-white focus:px-3 focus:py-2 focus:text-dark-slate"
        >
          Skip to main content
        </a>
        {children}
        <footer className="border-t border-dark-slate/10 bg-dark-slate px-6 py-8 text-sm text-off-white sm:px-10">
          <div className="mx-auto max-w-6xl space-y-2">
            <p className="font-semibold">{businessName}</p>
            <p className="text-off-white/80">Serving {serviceAreasLabel}</p>
            <p className="text-off-white/80">Call us: {phoneNumber}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
