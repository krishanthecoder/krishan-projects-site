"use client";

import { Card, Stack, Text } from "@sanity/ui";
import { useEffect, useRef } from "react";
import {
  useDocumentOperation,
  useFormValue,
  type ObjectInputProps,
} from "sanity";

/**
 * Shows the public project URL and, when the slug changes, keeps the old
 * value in `previousSlugs` so the site can permanently redirect.
 */
export function ProjectSlugInput(props: ObjectInputProps) {
  const documentId = useFormValue(["_id"]) as string | undefined;
  const documentType = useFormValue(["_type"]) as string | undefined;
  const previousSlugs =
    (useFormValue(["previousSlugs"]) as string[] | undefined) ?? [];
  const slugCurrent = (props.value as { current?: string } | undefined)?.current;

  const publishedId = documentId?.startsWith("drafts.")
    ? documentId.slice("drafts.".length)
    : documentId;
  const { patch } = useDocumentOperation(publishedId ?? "", documentType ?? "project");

  const lastSlugRef = useRef<string | undefined>(slugCurrent?.trim() || undefined);
  const previousSlugsRef = useRef(previousSlugs);
  previousSlugsRef.current = previousSlugs;

  useEffect(() => {
    const next = slugCurrent?.trim() || undefined;
    const prev = lastSlugRef.current;

    if (prev && next && prev !== next && !previousSlugsRef.current.includes(prev)) {
      patch.execute([
        {
          set: {
            previousSlugs: [...previousSlugsRef.current, prev],
          },
        },
      ]);
    }

    if (next) {
      lastSlugRef.current = next;
    }
  }, [slugCurrent, patch]);

  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      <Card padding={3} radius={2} tone="transparent" border>
        <Text size={1} muted>
          {slugCurrent?.trim()
            ? `Public page URL: /projects/${slugCurrent.trim()}`
            : "Generate a slug to set the public page URL."}
        </Text>
        {previousSlugs.length > 0 ? (
          <Text size={1} muted style={{ marginTop: "0.5rem", display: "block" }}>
            Older URLs redirect here:{" "}
            {previousSlugs.map((s) => `/projects/${s}`).join(", ")}
          </Text>
        ) : null}
      </Card>
    </Stack>
  );
}
