/** Convert Sanity hotspot (0–1) to CSS object-position for cropped `object-cover` images. */
export function objectPositionFromHotspot(
  hotspot?: { x?: number; y?: number } | null,
): string | undefined {
  if (
    !hotspot ||
    typeof hotspot.x !== "number" ||
    typeof hotspot.y !== "number" ||
    Number.isNaN(hotspot.x) ||
    Number.isNaN(hotspot.y)
  ) {
    return undefined;
  }
  return `${hotspot.x * 100}% ${hotspot.y * 100}%`;
}
