import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { DEFAULT_STRUCTURE_PATH } from "./sanity/structurePaneIds";

const BARE_STUDIO_PATHS = new Set(["/studio/structure", "/studio/structure/"]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!BARE_STUDIO_PATHS.has(pathname)) {
    return;
  }

  const url = request.nextUrl.clone();
  url.pathname = DEFAULT_STRUCTURE_PATH;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/studio/structure", "/studio/structure/"],
};
