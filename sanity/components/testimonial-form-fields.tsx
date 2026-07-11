import type { CSSProperties } from "react";

type StarPickerProps = {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
};

type StarRatingProps = {
  value: number;
  size?: "sm" | "md";
};

export function TestimonialStarRating({ value, size = "sm" }: StarRatingProps) {
  const fontSize = size === "sm" ? "0.95rem" : "1.6rem";
  const roundedRating = Math.max(0, Math.min(5, Math.round(value)));

  return (
    <span
      style={{ display: "inline-flex", alignItems: "center", gap: "0.125rem" }}
      aria-label={`${value} out of 5 stars`}
      title={`${value} / 5`}
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1;
        const active = starValue <= roundedRating;

        return (
          <span
            key={starValue}
            aria-hidden
            style={{
              fontSize,
              lineHeight: 1,
              color: active ? "#ffde21" : "#c7c7c7",
            }}
          >
            ★
          </span>
        );
      })}
    </span>
  );
}

export function TestimonialStarPicker({ value, onChange, disabled }: StarPickerProps) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
        {Array.from({ length: 5 }).map((_, index) => {
          const starValue = index + 1;
          const active = starValue <= value;

          return (
            <button
              key={starValue}
              type="button"
              disabled={disabled}
              aria-label={`Set rating to ${starValue} out of 5`}
              onClick={() => onChange(starValue)}
              style={{
                fontSize: "1.6rem",
                lineHeight: 1,
                color: active ? "#ffde21" : "#c7c7c7",
                background: "transparent",
                border: "none",
                cursor: disabled ? "not-allowed" : "pointer",
                padding: 0,
              }}
            >
              ★
            </button>
          );
        })}
      </div>
      <p style={ratingHelpStyle}>Selected rating: {value || 0} / 5</p>
    </div>
  );
}

export const testimonialFieldLabelStyle: CSSProperties = {
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "#374151",
};

export const testimonialInputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "0.625rem 0.75rem",
  borderRadius: "0.375rem",
  border: "1px solid #d1d5db",
  fontSize: "0.875rem",
};

export const testimonialReadOnlyInputStyle: CSSProperties = {
  ...testimonialInputStyle,
  background: "#f3f4f6",
  color: "#6b7280",
  cursor: "default",
};

export const testimonialTextareaStyle: CSSProperties = {
  ...testimonialInputStyle,
  resize: "vertical",
  minHeight: "8rem",
  lineHeight: 1.55,
};

export const testimonialReadOnlyTextareaStyle: CSSProperties = {
  ...testimonialTextareaStyle,
  background: "#f3f4f6",
  color: "#6b7280",
  cursor: "default",
};

const ratingHelpStyle: CSSProperties = {
  margin: "0.5rem 0 0",
  fontSize: "0.8rem",
  color: "#6b7280",
};
