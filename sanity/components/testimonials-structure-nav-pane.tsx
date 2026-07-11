import { ChevronRightIcon, DocumentsIcon } from "@sanity/icons";
import type { CSSProperties } from "react";
import { useMemo } from "react";
import { usePaneRouter } from "sanity/structure";

import type { TestimonialStructureCounts } from "../../lib/testimonial-structure-counts";
import { useTestimonialStructureCounts } from "../hooks/useTestimonialStructureCounts";
import {
  TESTIMONIAL_SUBMISSIONS_LIST_ITEM_ID,
  TESTIMONIALS_DISCARDED_LIST_ID,
  TESTIMONIALS_PUBLISHED_LIST_ID,
} from "../structurePaneIds";

type NavRow = {
  id: string;
  label: string;
  countKey: keyof TestimonialStructureCounts;
  highlightWhenPositive?: boolean;
};

const rows: NavRow[] = [
  {
    id: TESTIMONIAL_SUBMISSIONS_LIST_ITEM_ID,
    label: "Pending submissions",
    countKey: "pending",
    highlightWhenPositive: true,
  },
  {
    id: TESTIMONIALS_PUBLISHED_LIST_ID,
    label: "Published on site",
    countKey: "published",
  },
  {
    id: TESTIMONIALS_DISCARDED_LIST_ID,
    label: "Discarded",
    countKey: "discarded",
  },
];

function formatCount(value: number) {
  return value > 99 ? "99+" : String(value);
}

export function TestimonialsStructureNavPane() {
  const { ChildLink, groupIndex, index, routerPanesState } = usePaneRouter();
  const { counts, loading } = useTestimonialStructureCounts();

  const selectedChildId = useMemo(() => {
    const siblings = routerPanesState[groupIndex];
    if (!siblings?.length) return null;
    const nextPane = siblings[index + 1];
    return typeof nextPane?.id === "string" ? nextPane.id : null;
  }, [groupIndex, index, routerPanesState]);

  return (
    <nav className="kp-testimonials-nav" aria-label="Customer Reviews">
      <ul style={listStyle}>
        {rows.map((row, rowIndex) => {
          const count = counts[row.countKey];
          const isActive = selectedChildId === row.id;
          const highlight = Boolean(row.highlightWhenPositive && count > 0);

          return (
            <li key={row.id}>
              {rowIndex === 1 ? <div style={dividerStyle} role="separator" /> : null}
              <ChildLink childId={row.id}>
                <span
                  className={`kp-testimonials-nav__row${isActive ? " kp-testimonials-nav__row--active" : ""}`}
                  style={rowStyle}
                >
                  <span style={leadingStyle}>
                    <DocumentsIcon />
                  </span>
                  <span style={labelStyle}>{row.label}</span>
                  <span
                    className={`kp-testimonials-nav__badge${highlight ? " kp-testimonials-nav__badge--highlight" : ""}`}
                    style={badgeStyle}
                    aria-label={`${count} ${row.label.toLowerCase()}`}
                  >
                    {loading ? "…" : formatCount(count)}
                  </span>
                  <span style={chevronStyle} aria-hidden="true">
                    <ChevronRightIcon />
                  </span>
                </span>
              </ChildLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

const listStyle: CSSProperties = {
  listStyle: "none",
  margin: 0,
  padding: 0,
};

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.625rem",
  width: "100%",
  minHeight: "2.75rem",
  padding: "0.5rem 0.75rem",
  boxSizing: "border-box",
  textDecoration: "none",
  color: "inherit",
  cursor: "pointer",
};

const leadingStyle: CSSProperties = {
  display: "inline-flex",
  flexShrink: 0,
  fontSize: "1.125rem",
  color: "#6b7280",
};

const labelStyle: CSSProperties = {
  flex: 1,
  fontSize: "0.875rem",
  fontWeight: 500,
  color: "#111827",
  textAlign: "left",
};

const badgeStyle: CSSProperties = {
  flexShrink: 0,
};

const chevronStyle: CSSProperties = {
  display: "inline-flex",
  flexShrink: 0,
  fontSize: "1rem",
  color: "#9ca3af",
};

const dividerStyle: CSSProperties = {
  height: 1,
  margin: "0.375rem 0.75rem",
  background: "#e5e7eb",
};
