import type { NumberInputProps } from "sanity";
import { set } from "sanity";

export function StarRatingInput(props: NumberInputProps) {
  const currentRating = typeof props.value === "number" ? props.value : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => {
          const starValue = index + 1;
          const active = starValue <= currentRating;

          return (
            <button
              key={`star-input-${starValue}`}
              type="button"
              onClick={() => props.onChange(set(starValue))}
              disabled={props.readOnly}
              aria-label={`Set rating to ${starValue} out of 5`}
              style={{
                fontSize: "1.6rem",
                lineHeight: 1,
                color: active ? "#ffde21" : "#c7c7c7",
                background: "transparent",
                border: "none",
                cursor: props.readOnly ? "not-allowed" : "pointer",
                padding: 0,
              }}
            >
              ★
            </button>
          );
        })}
      </div>
      <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>Selected rating: {currentRating || 0} / 5</p>
    </div>
  );
}
