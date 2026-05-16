import type { GalleryCategory } from "./sanity.queries";

const localeSort = (a: string, b: string) =>
  a.localeCompare(b, "en", { sensitivity: "base" });

/** Filter pills after “All Projects” — A–Z by display title. */
export function sortGalleryCategoriesAlphabetically(
  categories: GalleryCategory[],
): GalleryCategory[] {
  return [...categories].sort((a, b) => localeSort(a.title, b.title));
}

/** Display labels (e.g. project page pills) — A–Z, deduped. */
export function sortLabelsAlphabetically(labels: string[]): string[] {
  const unique = [...new Set(labels.map((label) => label.trim()).filter(Boolean))];
  return unique.sort(localeSort);
}
