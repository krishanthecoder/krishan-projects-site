import { NotFoundContent } from "@/components/not-found-content";

/**
 * 404 inside the marketing site — `(site)/layout` already provides SiteChrome.
 * Keep this file so project/page notFound() calls do not also use the root
 * not-found (which wraps SiteChrome again and doubles the header).
 */
export default function SiteNotFound() {
  return <NotFoundContent />;
}
