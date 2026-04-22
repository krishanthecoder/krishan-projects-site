import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio",
  description: "Content management studio for Krishan Projects.",
  robots: "noindex, nofollow",
};

export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
