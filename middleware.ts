import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { DEFAULT_STRUCTURE_PATH } from "./sanity/structurePaneIds";

const BARE_STUDIO_PATHS = new Set(["/studio/structure", "/studio/structure/"]);

const PROJECT_PATH = /^\/projects\/([^/]+)\/?$/;

/**
 * Resolve the canonical project slug (current or via previousSlugs).
 * Used so renaming a slug in Studio automatically updates public URLs.
 */
async function resolveCanonicalProjectSlug(
  slug: string,
): Promise<string | null> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return null;

  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  const apiVersion =
    process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-04-21";

  const query = `coalesce(
    *[_type == "project" && slug.current == $slug][0].slug.current,
    *[_type == "project" && $slug in previousSlugs][0].slug.current
  )`;

  const url = new URL(
    `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`,
  );
  url.searchParams.set("query", query);
  url.searchParams.set("$slug", JSON.stringify(slug));

  try {
    const response = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as { result?: string | null };
    return typeof payload.result === "string" && payload.result.length > 0
      ? payload.result
      : null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (BARE_STUDIO_PATHS.has(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = DEFAULT_STRUCTURE_PATH;
    return NextResponse.redirect(url);
  }

  const projectMatch = pathname.match(PROJECT_PATH);
  if (projectMatch) {
    const requestedSlug = decodeURIComponent(projectMatch[1] ?? "");
    if (requestedSlug) {
      const canonicalSlug = await resolveCanonicalProjectSlug(requestedSlug);
      if (canonicalSlug && canonicalSlug !== requestedSlug) {
        const url = request.nextUrl.clone();
        url.pathname = `/projects/${canonicalSlug}`;
        return NextResponse.redirect(url, 308);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/studio/structure",
    "/studio/structure/",
    "/projects/:slug",
  ],
};
