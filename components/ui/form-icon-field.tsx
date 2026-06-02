import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type FormIconFieldProps = {
  icon: LucideIcon;
  error?: string;
  multiline?: boolean;
  className?: string;
  children: ReactNode;
};

export function FormIconField({
  icon: Icon,
  error,
  multiline = false,
  className = "",
  children,
}: FormIconFieldProps) {
  return (
    <div className={className}>
      <div
        className={[
          "kp-lead-icon-field",
          multiline ? "kp-lead-icon-field--textarea" : "",
          error ? "kp-lead-icon-field--error" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Icon className="kp-lead-icon-field__icon" aria-hidden strokeWidth={1.75} />
        <div className="kp-lead-icon-field__control">{children}</div>
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-rose-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
