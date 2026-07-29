/** Resolve a stable asset id from either a reference (`_ref`) or expanded asset (`_id`). */
export function imageAssetRef(
  image:
    | {
        asset?: { _ref?: string; _id?: string } | null;
      }
    | null
    | undefined,
): string | undefined {
  const asset = image?.asset;
  if (!asset) return undefined;
  return asset._ref ?? asset._id;
}
