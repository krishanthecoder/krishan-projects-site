"use client";

type TestimonialStarPickerProps = {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
  error?: string;
};

export function TestimonialStarPicker({
  value,
  onChange,
  disabled = false,
  error,
}: TestimonialStarPickerProps) {
  return (
    <div>
      <p className="text-sm font-medium text-graphite">Your rating *</p>
      <div
        className="mt-2 flex gap-1"
        role="radiogroup"
        aria-label="Star rating out of 5"
        aria-invalid={error ? true : undefined}
      >
        {[1, 2, 3, 4, 5].map((starValue) => {
          const active = starValue <= value;

          return (
            <button
              key={starValue}
              type="button"
              disabled={disabled}
              onClick={() => onChange(starValue)}
              className={`text-2xl leading-none transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                active ? "text-gold" : "text-gold/25 hover:text-gold/45"
              }`}
              role="radio"
              aria-checked={value === starValue}
              aria-label={`${starValue} out of 5 stars`}
            >
              ★
            </button>
          );
        })}
      </div>
      {error ? (
        <p className="mt-1 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : (
        <p className="mt-1 text-xs text-warm-mist">
          {value > 0 ? `${value} out of 5 selected` : "Tap a star to rate"}
        </p>
      )}
    </div>
  );
}
