"use client";

import { AddIcon } from "@sanity/icons";
import { Box, Button, Card, Flex, Label, Stack, Text } from "@sanity/ui";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ArrayOfObjectsInputProps } from "sanity";
import { useClient, useFormValue } from "sanity";

import { sanityApiVersion } from "../env";
import {
  EXISTING_GALLERY_TAGS_QUERY,
  type ExistingGalleryTag,
} from "../lib/existing-gallery-tags-query";
import type { GalleryCategoryTagValue } from "../lib/gallery-tag-utils";
import { GalleryCategoriesArrayFunctions } from "./gallery-categories-array-functions";

function tagKey() {
  return `tag-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeTag(row: { title?: string; slug?: string | null }): ExistingGalleryTag | null {
  const title = row.title?.trim();
  const slug = row.slug?.trim();
  if (!title || !slug) return null;
  return { title, slug };
}

function tagsEqual(
  a: GalleryCategoryTagValue,
  b: ExistingGalleryTag,
): boolean {
  const slug = a.slug?.current?.trim();
  return slug === b.slug;
}

export function GalleryCategoriesInput(props: ArrayOfObjectsInputProps) {
  const { renderDefault, onItemAppend, value } = props;
  const client = useClient({ apiVersion: sanityApiVersion });
  const documentId = useFormValue(["_id"]) as string | undefined;

  const [catalog, setCatalog] = useState<ExistingGalleryTag[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  const currentTags = (value ?? []) as GalleryCategoryTagValue[];

  useEffect(() => {
    let active = true;

    async function load() {
      setLoadingCatalog(true);
      try {
        const rows = await client.fetch<Array<{ title?: string; slug?: string | null }>>(
          EXISTING_GALLERY_TAGS_QUERY,
        );
        if (!active) return;

        const bySlug = new Map<string, ExistingGalleryTag>();
        for (const row of rows ?? []) {
          const tag = normalizeTag(row);
          if (tag && !bySlug.has(tag.slug)) {
            bySlug.set(tag.slug, tag);
          }
        }

        setCatalog(
          Array.from(bySlug.values()).sort((a, b) =>
            a.title.localeCompare(b.title, "en", { sensitivity: "base" }),
          ),
        );
      } catch (error) {
        console.error("Failed to load existing gallery tags", error);
        if (active) setCatalog([]);
      } finally {
        if (active) setLoadingCatalog(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [client, documentId]);

  const availableExisting = useMemo(() => {
    return catalog.filter(
      (tag) => !currentTags.some((assigned) => tagsEqual(assigned, tag)),
    );
  }, [catalog, currentTags]);

  const appendExistingTag = useCallback(
    (tag: ExistingGalleryTag) => {
      onItemAppend({
        _type: "galleryCategoryTag",
        _key: tagKey(),
        title: tag.title,
        slug: { _type: "slug", current: tag.slug },
      } as GalleryCategoryTagValue & { _key: string });
    },
    [onItemAppend],
  );

  const existingTagsHint = useMemo(() => {
    if (loadingCatalog) {
      return "Loading tags from other projects…";
    }
    if (catalog.length === 0) {
      return "No tags on other projects yet. Use Add tag below to create the first one.";
    }
    if (availableExisting.length === 0) {
      return "Every tag from other projects is already on this project.";
    }
    return null;
  }, [availableExisting.length, catalog.length, loadingCatalog]);

  return (
    <Stack space={4}>
      <Card padding={3} radius={2} shadow={1} tone="transparent" border>
        <Stack space={3}>
          <Label size={1}>Add an existing tag</Label>
          <Text muted size={1}>
            Reuse tags from other projects (e.g. Painting) so names and slugs stay
            consistent.
          </Text>

          {availableExisting.length > 0 ? (
            <Flex gap={2} wrap="wrap">
              {availableExisting.map((tag) => (
                <Button
                  key={tag.slug}
                  icon={AddIcon}
                  mode="ghost"
                  text={tag.title}
                  tone="primary"
                  onClick={() => appendExistingTag(tag)}
                />
              ))}
            </Flex>
          ) : existingTagsHint ? (
            <Box padding={1}>
              <Text muted size={1}>
                {existingTagsHint}
              </Text>
            </Box>
          ) : null}
        </Stack>
      </Card>

      {renderDefault({
        ...props,
        arrayFunctions: GalleryCategoriesArrayFunctions,
      })}
    </Stack>
  );
}
