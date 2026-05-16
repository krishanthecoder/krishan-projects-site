"use client";

import { AddIcon } from "@sanity/icons";
import { Box, Button, Card, Flex, Label, Stack, Text, useToast } from "@sanity/ui";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ArrayOfObjectsInputProps } from "sanity";
import { useClient, useFormValue } from "sanity";

import { sanityApiVersion } from "../env";
import {
  EXISTING_GALLERY_TAGS_QUERY,
  type ExistingGalleryTag,
} from "../lib/existing-gallery-tags-query";
import {
  formatGalleryTagTitle,
  galleryTagSlugFromTitle,
  type GalleryCategoryTagValue,
  isValidGalleryTagTitle,
} from "../lib/gallery-tag-utils";
import { GalleryCategoryTagsChipField } from "./gallery-category-tags-chip-field";

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
  const { onItemAppend, onItemRemove, readOnly, value } = props;
  const client = useClient({ apiVersion: sanityApiVersion });
  const documentId = useFormValue(["_id"]) as string | undefined;
  const toast = useToast();

  const [catalog, setCatalog] = useState<ExistingGalleryTag[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [newTagDraft, setNewTagDraft] = useState("");

  const currentTags = (value ?? []) as GalleryCategoryTagValue[];
  const disabled = Boolean(readOnly);

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
        title: formatGalleryTagTitle(tag.title),
        slug: { _type: "slug", current: tag.slug },
      } as GalleryCategoryTagValue & { _key: string });
    },
    [onItemAppend],
  );

  const appendNewTag = useCallback(
    (rawTitle: string) => {
      const title = formatGalleryTagTitle(rawTitle);
      const slug = galleryTagSlugFromTitle(title);

      if (!isValidGalleryTagTitle(title)) {
        toast.push({
          status: "error",
          title: "Tag title too short",
          description: "Enter at least 2 characters for the tag title.",
        });
        return false;
      }

      const alreadyOnProject = currentTags.some(
        (assigned) => assigned.slug?.current?.trim() === slug,
      );
      if (alreadyOnProject) {
        toast.push({
          status: "warning",
          title: "Tag already on this project",
          description: `"${title}" is already in the list.`,
        });
        return false;
      }

      onItemAppend({
        _type: "galleryCategoryTag",
        _key: tagKey(),
        title,
        slug: { _type: "slug", current: slug },
      } as GalleryCategoryTagValue & { _key: string });

      return true;
    },
    [currentTags, onItemAppend, toast],
  );

  const handleQuickAdd = useCallback(() => {
    if (appendNewTag(newTagDraft)) {
      setNewTagDraft("");
    }
  }, [appendNewTag, newTagDraft]);

  const handleRemoveTag = useCallback(
    (key: string) => {
      onItemRemove(key);
    },
    [onItemRemove],
  );

  const existingTagsHint = useMemo(() => {
    if (loadingCatalog) {
      return "Loading tags from other projects…";
    }
    if (catalog.length === 0) {
      return "No tags on other projects yet. Type a new tag above.";
    }
    if (availableExisting.length === 0) {
      return "Every tag from other projects is already on this project.";
    }
    return null;
  }, [availableExisting.length, catalog.length, loadingCatalog]);

  return (
    <Stack space={4}>
      <Stack space={2}>
        <Label size={1} weight="semibold">
          Your tags
        </Label>
        <GalleryCategoryTagsChipField
          tags={currentTags}
          draft={newTagDraft}
          disabled={disabled}
          placeholder="Type a tag and press Enter"
          onDraftChange={setNewTagDraft}
          onDraftSubmit={handleQuickAdd}
          onRemoveTag={handleRemoveTag}
        />
      </Stack>

      <Card padding={3} radius={2} className="kp-gallery-categories-existing" tone="transparent" border>
        <Stack space={3}>
          <Label size={1} weight="semibold">
            Add an existing tag
          </Label>
          <Text muted size={1}>
            Reuse tags from other projects so names and slugs stay consistent.
          </Text>

          {availableExisting.length > 0 ? (
            <Flex gap={2} wrap="wrap">
              {availableExisting.map((tag) => (
                <Button
                  key={tag.slug}
                  icon={AddIcon}
                  mode="bleed"
                  text={tag.title}
                  tone="primary"
                  disabled={disabled}
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
    </Stack>
  );
}
