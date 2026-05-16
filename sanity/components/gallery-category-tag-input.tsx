"use client";

import type { ObjectInputProps } from "sanity";

/** Fields only — footer “Add tag” is portaled from the array item when the dialog is open. */
export function GalleryCategoryTagInput(props: ObjectInputProps) {
  return props.renderDefault(props);
}
