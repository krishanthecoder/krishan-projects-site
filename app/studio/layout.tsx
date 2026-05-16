import type { Metadata } from "next";

import { StudioEntryPathScript } from "./StudioEntryPathScript";

export const metadata: Metadata = {
  title: "Studio",
  description: "Content management studio for Krishan Projects.",
  robots: "noindex, nofollow",
};

/**
 * Embedded Sanity needs the full viewport. The marketing layout (navbar/footer)
 * lives under `app/(site)` so it does not squeeze Studio and hide the document
 * action bar (Publish / Delete).
 */
export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <StudioEntryPathScript />
      <div className="fixed inset-0 z-[100] flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden bg-stone-white">
        <div className="relative min-h-0 flex-1">{children}</div>
      </div>
    </>
  );
}
