import { NotFoundContent } from "@/components/not-found-content";
import { SiteChrome } from "@/components/site-chrome";

/**
 * Global unmatched routes (e.g. /apple) — root layout only, so wrap chrome here.
 * Segment 404s under `(site)` use `app/(site)/not-found.tsx` instead.
 */
export default function NotFound() {
  return (
    <SiteChrome>
      <NotFoundContent />
    </SiteChrome>
  );
}
