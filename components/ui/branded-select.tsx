"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

export type BrandedSelectOption = {
  value: string;
  label: string;
};

type BrandedSelectProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: readonly BrandedSelectOption[];
  placeholder?: string;
  embedded?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

export function BrandedSelect({
  id: idProp,
  value,
  onChange,
  onBlur,
  options,
  placeholder = "Select an option",
  embedded = false,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: BrandedSelectProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const listboxId = `${id}-listbox`;

  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selectedLabel =
    selectedIndex >= 0 ? options[selectedIndex]?.label : placeholder;
  const hasValue = value.length > 0;

  const close = useCallback(() => {
    setOpen(false);
    setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [selectedIndex]);

  const selectOption = useCallback(
    (index: number) => {
      const option = options[index];
      if (!option) return;
      setOpen(false);
      onChange(option.value);
      setHighlightedIndex(index);
      onBlur?.();
    },
    [onBlur, onChange, options],
  );

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        close();
        onBlur?.();
      }
    };

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [close, onBlur, open]);

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      if (open) {
        selectOption(highlightedIndex);
      } else {
        setOpen(true);
        setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
        return;
      }
      setHighlightedIndex((current) => Math.min(current + 1, options.length - 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
        return;
      }
      setHighlightedIndex((current) => Math.max(current - 1, 0));
      return;
    }

    if (event.key === "Home" && open) {
      event.preventDefault();
      setHighlightedIndex(0);
      return;
    }

    if (event.key === "End" && open) {
      event.preventDefault();
      setHighlightedIndex(options.length - 1);
    }
  };

  return (
    <div
      ref={rootRef}
      className={embedded ? "kp-branded-select kp-branded-select--embedded" : "kp-branded-select"}
    >
      <span className="kp-lead-select-wrap">
        <button
          type="button"
          id={id}
          className={`kp-lead-select text-left ${hasValue ? "" : "kp-lead-select--placeholder"}`}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          onClick={(event) => {
            event.stopPropagation();
            if (open) {
              close();
            } else {
              setOpen(true);
              setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
            }
          }}
          onKeyDown={handleTriggerKeyDown}
          onBlur={(event) => {
            if (!rootRef.current?.contains(event.relatedTarget as Node)) {
              onBlur?.();
            }
          }}
        >
          {selectedLabel}
        </button>
      </span>

      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={ariaLabelledBy ?? id}
          className="kp-lead-select-list"
          onPointerDown={(event) => event.stopPropagation()}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isHighlighted = index === highlightedIndex;

            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                className={[
                  "kp-lead-select-option",
                  isSelected ? "is-selected" : "",
                  isHighlighted ? "is-highlighted" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onMouseEnter={() => setHighlightedIndex(index)}
                onPointerDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  selectOption(index);
                }}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
