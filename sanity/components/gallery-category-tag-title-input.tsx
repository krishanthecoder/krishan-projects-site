"use client";

import { useCallback } from "react";
import type { FormPatch, StringInputProps } from "sanity";
import { PatchEvent, set } from "sanity";

import { formatGalleryTagTitle, galleryTagSlugFromTitle } from "../lib/gallery-tag-utils";

function getSetPatchValue(patch: FormPatch | PatchEvent | FormPatch[]): string {
  const patches = patch instanceof PatchEvent ? patch.patches : Array.isArray(patch) ? patch : [patch];
  const setPatch = patches.find((entry) => entry.type === "set");
  if (!setPatch || setPatch.type !== "set") {
    return "";
  }
  return typeof setPatch.value === "string" ? setPatch.value : String(setPatch.value ?? "");
}

/** Capitalizes the first letter and keeps the slug in sync with the title. */
export function GalleryCategoryTagTitleInput(props: StringInputProps) {
  const { onChange, path, renderDefault, value } = props;

  const applyTitle = useCallback(
    (raw: string) => {
      const title = formatGalleryTagTitle(raw);
      const slug = galleryTagSlugFromTitle(title);
      const parentPath = path.slice(0, -1);

      onChange(
        PatchEvent.from([
          set(title, path),
          set({ _type: "slug", current: slug }, [...parentPath, "slug"]),
        ]),
      );
    },
    [onChange, path],
  );

  const handleChange = useCallback(
    (patch: FormPatch | PatchEvent | FormPatch[]) => {
      applyTitle(getSetPatchValue(patch));
    },
    [applyTitle],
  );

  return renderDefault({
    ...props,
    value: typeof value === "string" ? value : "",
    onChange: handleChange,
  });
}
