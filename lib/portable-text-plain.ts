import type { PortableTextBlock } from "@/lib/sanity.queries";

type SpanChild = {
  text?: string;
  _type?: string;
};

type BlockLike = {
  _type?: string;
  children?: SpanChild[];
};

/**
 * Strips Portable Text to plain string for meta descriptions (no new dependencies).
 */
export function portableTextToPlain(
  blocks: PortableTextBlock[] | undefined,
  maxLen = 160,
): string {
  if (!Array.isArray(blocks) || blocks.length === 0) return "";

  const chunks: string[] = [];
  for (const raw of blocks) {
    const block = raw as BlockLike;
    if (block._type !== "block" || !Array.isArray(block.children)) continue;
    for (const child of block.children) {
      if (typeof child?.text === "string" && child.text.length > 0) {
        chunks.push(child.text);
      }
    }
    chunks.push(" ");
  }

  let text = chunks.join("").replace(/\s+/g, " ").trim();
  if (text.length <= maxLen) return text;

  text = text.slice(0, maxLen);
  const lastSpace = text.lastIndexOf(" ");
  if (lastSpace > maxLen * 0.6) text = text.slice(0, lastSpace);
  return `${text.trimEnd()}…`;
}
