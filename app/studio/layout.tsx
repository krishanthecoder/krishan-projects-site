import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio",
  robots: "noindex, nofollow",
};

export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
