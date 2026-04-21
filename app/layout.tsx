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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.krishanconstruction.com"),
  title: {
    default: "Krishan Construction Group",
    template: "%s | Krishan Construction Group",
  },
  description:
    "Premium commercial and residential construction services with engineering precision and modern project delivery.",
  keywords: [
    "construction",
    "commercial construction",
    "residential construction",
    "general contractor",
    "project management",
  ],
  openGraph: {
    title: "Krishan Construction Group",
    description:
      "Premium commercial and residential construction services with engineering precision and modern project delivery.",
    url: "https://www.krishanconstruction.com",
    siteName: "Krishan Construction Group",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Krishan Construction Group",
    description:
      "Premium commercial and residential construction services with engineering precision and modern project delivery.",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
