import { portableTextToPlain } from "@/lib/portable-text-plain";
import type { ProjectDetail } from "@/lib/sanity.queries";

const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME ?? "Krishan Projects";

/**
 * Meta / OG description: prefer first paragraph(s) of body, else a factual fallback (≤ ~160 chars).
 */
export function buildProjectMetaDescription(project: ProjectDetail): string {
  const fromBody = portableTextToPlain(project.description, 155);
  if (fromBody.length >= 70) return fromBody;

  const services = (project.services ?? [])
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4)
    .join(", ");
  const loc = project.projectLocation?.trim();

  const parts = [
    fromBody || null,
    loc ? `Location: ${loc}` : null,
    services ? `Services: ${services}` : null,
    `${businessName} project gallery and write-up.`,
  ].filter(Boolean) as string[];

  let out = parts.join(" ").replace(/\s+/g, " ").trim();
  if (out.length <= 160) return out;
  out = out.slice(0, 157).trimEnd();
  const cut = out.lastIndexOf(" ");
  if (cut > 100) out = out.slice(0, cut);
  return `${out}…`;
}
