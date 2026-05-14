import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { SANITY_CACHE_TAG } from "@/lib/sanity.client";

/**
 * On-demand cache purge after Sanity publishes. Add a GROQ webhook in Sanity Manage → API →
 * Webhooks pointing to: `POST https://your-domain.com/api/revalidate?secret=YOUR_SECRET`
 * with `SANITY_REVALIDATE_SECRET=YOUR_SECRET` in the deployment env.
 */
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const expected = process.env.SANITY_REVALIDATE_SECRET;

  if (!expected || secret !== expected) {
    return NextResponse.json({ revalidated: false, message: "Unauthorized" }, { status: 401 });
  }

  revalidateTag(SANITY_CACHE_TAG, "max");

  return NextResponse.json({ revalidated: true, tag: SANITY_CACHE_TAG });
}
