export default function StudioLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading Sanity Studio"
      className="flex h-full min-h-0 flex-1 flex-col items-center justify-center gap-4 bg-stone-white text-stone-700"
    >
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-stone-300 border-t-stone-800" />
      <p className="text-sm font-medium">Loading Studio…</p>
      <p className="max-w-sm px-6 text-center text-xs text-stone-500">
        First load compiles the CMS in the background. Later visits are much faster.
      </p>
    </div>
  );
}
