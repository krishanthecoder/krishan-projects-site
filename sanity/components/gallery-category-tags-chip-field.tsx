"use client";

import { CloseIcon } from "@sanity/icons";
import { Text } from "@sanity/ui";
import { useCallback, useRef } from "react";
import { styled } from "styled-components";

import type { GalleryCategoryTagValue } from "../lib/gallery-tag-utils";
import { formatGalleryTagTitle } from "../lib/gallery-tag-utils";

const ChipFieldRoot = styled.div<{ $disabled?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  min-height: 3rem;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid var(--card-border-color, #ced2d9);
  background: var(--card-bg-color, #fff);
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "text")};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};

  &:focus-within {
    border-color: var(--input-focused-border-color, #2276fc);
    box-shadow: 0 0 0 1px var(--input-focused-border-color, #2276fc);
  }
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  max-width: 100%;
  padding: 4px 4px 4px 10px;
  border-radius: 999px;
  background: var(--card-muted-bg-color, #f1f3f6);
  border: 1px solid var(--card-border-color, #e3e6ea);
  font-size: 14px;
`;

const ChipRemoveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: var(--card-muted-fg-color, #6e7683);
  cursor: pointer;

  &:hover {
    background: var(--card-border-color, #e3e6ea);
    color: var(--card-fg-color, #1f2123);
  }

  &:focus-visible {
    outline: 2px solid var(--input-focused-border-color, #2276fc);
    outline-offset: 1px;
  }
`;

const ChipTextInput = styled.input`
  flex: 1 1 120px;
  min-width: 120px;
  border: none;
  outline: none;
  background: transparent;
  font: inherit;
  font-size: 13px;
  line-height: 1.25;
  padding: 4px 2px;
  color: var(--card-fg-color, #1f2123);

  &::placeholder {
    color: var(--card-muted-fg-color, #6e7683);
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

type GalleryCategoryTagsChipFieldProps = {
  tags: GalleryCategoryTagValue[];
  draft: string;
  disabled?: boolean;
  placeholder?: string;
  onDraftChange: (value: string) => void;
  onDraftSubmit: () => void;
  onRemoveTag: (key: string) => void;
};

export function GalleryCategoryTagsChipField({
  tags,
  draft,
  disabled,
  placeholder = "Type a tag and press Enter",
  onDraftChange,
  onDraftSubmit,
  onRemoveTag,
}: GalleryCategoryTagsChipFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = useCallback(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        onDraftSubmit();
        return;
      }

      if (
        event.key === "Backspace" &&
        draft.length === 0 &&
        tags.length > 0
      ) {
        const last = tags[tags.length - 1];
        if (last._key) {
          event.preventDefault();
          onRemoveTag(last._key);
        }
      }
    },
    [draft.length, onDraftSubmit, onRemoveTag, tags],
  );

  return (
    <ChipFieldRoot
      className="kp-gallery-chip-field"
      $disabled={disabled}
      onClick={focusInput}
      role="group"
    >
      {tags.map((tag) => {
        const key = tag._key;
        if (!key) {
          return null;
        }

        const label = formatGalleryTagTitle(tag.title ?? "") || "Untitled";

        return (
          <Chip key={key}>
            <Text size={1} weight="medium">
              {label}
            </Text>
            <ChipRemoveButton
              type="button"
              aria-label={`Remove ${label}`}
              disabled={disabled}
              onClick={(event) => {
                event.stopPropagation();
                onRemoveTag(key);
              }}
            >
              <CloseIcon />
            </ChipRemoveButton>
          </Chip>
        );
      })}
      <ChipTextInput
        ref={inputRef}
        value={draft}
        disabled={disabled}
        placeholder={tags.length === 0 ? placeholder : ""}
        onChange={(event) => onDraftChange(formatGalleryTagTitle(event.target.value))}
        onKeyDown={handleKeyDown}
        onClick={(event) => event.stopPropagation()}
      />
    </ChipFieldRoot>
  );
}
