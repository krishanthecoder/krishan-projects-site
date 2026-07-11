import type { CSSProperties } from "react";
import { useCallback, useEffect, useState } from "react";
import { useClient } from "sanity";
import { usePaneRouter } from "sanity/structure";

import { sanityApiVersion } from "../env";
import { useTestimonialMutationRefresh } from "../hooks/useTestimonialMutationRefresh";
import {
  TESTIMONIAL_WORKFLOW_CHANGED_EVENT,
  type TestimonialWorkflowChangedDetail,
} from "../lib/testimonial-workflow";
import { TESTIMONIAL_DISCARDED_EDIT_LIST_ITEM_ID } from "../structurePaneIds";

type DiscardedTestimonial = {
  _id: string;
  clientName: string;
  jobTitle: string;
  rating: number;
};

const discardedQuery = `*[_type == "testimonial" && !(_id in path("drafts.**")) && status == "discarded"] | order(_createdAt desc){
  _id,
  clientName,
  jobTitle,
  rating
}`;

export function DiscardedTestimonialsPane() {
  const client = useClient({ apiVersion: sanityApiVersion });
  const { ChildLink } = usePaneRouter();
  const [rows, setRows] = useState<DiscardedTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const loadDiscarded = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setLoading(true);
    }
    setError(null);

    try {
      const next = await client.fetch<DiscardedTestimonial[]>(discardedQuery);
      setRows(next);
    } catch (err) {
      console.error(err);
      setError("Could not load discarded reviews.");
    } finally {
      if (!options?.silent) {
        setLoading(false);
      }
    }
  }, [client]);

  useEffect(() => {
    void loadDiscarded();
  }, [loadDiscarded]);

  useTestimonialMutationRefresh(() => {
    void loadDiscarded({ silent: true });
  });

  useEffect(() => {
    const onWorkflowChanged = (event: Event) => {
      const detail = (event as CustomEvent<TestimonialWorkflowChangedDetail>).detail;
      if (!detail?.documentId) {
        return;
      }

      if (detail.status === "published" || detail.status === "deleted") {
        setRows((current) => current.filter((row) => row._id !== detail.documentId));
      }
    };

    window.addEventListener(TESTIMONIAL_WORKFLOW_CHANGED_EVENT, onWorkflowChanged);
    return () => {
      window.removeEventListener(TESTIMONIAL_WORKFLOW_CHANGED_EVENT, onWorkflowChanged);
    };
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredRows = normalizedQuery
    ? rows.filter((row) => {
        const haystack = `${row.clientName} ${row.jobTitle}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : rows;

  return (
    <div style={paneStyle}>
      <header style={headerStyle}>
        <h2 style={titleStyle}>Discarded</h2>
        <p style={helpStyle}>
          Reviews removed from the website. Restore one to publish it again, or permanently delete it.
        </p>
      </header>

      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search list"
        style={searchStyle}
        aria-label="Search discarded reviews"
      />

      {error ? <p style={errorStyle}>{error}</p> : null}

      {loading ? (
        <p style={helpStyle}>Loading…</p>
      ) : filteredRows.length === 0 ? (
        <div style={emptyStyle}>
          <p style={emptyTitleStyle}>No discarded reviews</p>
          <p style={helpStyle}>
            {normalizedQuery ? "Try a different search." : "Discarded reviews will appear here."}
          </p>
        </div>
      ) : (
        <ul style={listStyle}>
          {filteredRows.map((row) => (
            <li key={row._id}>
              <ChildLink
                childId={TESTIMONIAL_DISCARDED_EDIT_LIST_ITEM_ID}
                childPayload={{ documentId: row._id }}
              >
                <button type="button" style={rowButtonStyle}>
                  <span style={rowTitleStyle}>{row.clientName}</span>
                  <span style={rowMetaStyle}>
                    {row.jobTitle} · {row.rating}/5
                  </span>
                </button>
              </ChildLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const paneStyle: CSSProperties = {
  padding: "1rem",
  boxSizing: "border-box",
  height: "100%",
  overflow: "auto",
};

const headerStyle: CSSProperties = {
  marginBottom: "1rem",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: "1rem",
  fontWeight: 700,
};

const helpStyle: CSSProperties = {
  margin: "0.5rem 0 0",
  fontSize: "0.8125rem",
  lineHeight: 1.5,
  color: "#6b7280",
};

const errorStyle: CSSProperties = {
  margin: "0.75rem 0",
  color: "#b91c1c",
  fontSize: "0.875rem",
  fontWeight: 600,
};

const searchStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  marginBottom: "0.75rem",
  padding: "0.625rem 0.75rem",
  borderRadius: "0.375rem",
  border: "1px solid #d1d5db",
  fontSize: "0.875rem",
};

const emptyStyle: CSSProperties = {
  border: "1px dashed #d1d5db",
  borderRadius: "0.75rem",
  padding: "1.25rem",
  background: "#fafafa",
};

const emptyTitleStyle: CSSProperties = {
  margin: 0,
  fontWeight: 600,
};

const listStyle: CSSProperties = {
  listStyle: "none",
  margin: 0,
  padding: 0,
};

const rowButtonStyle: CSSProperties = {
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: "0.75rem 0.875rem",
  border: "none",
  borderBottom: "1px solid #e5e7eb",
  background: "transparent",
  cursor: "pointer",
};

const rowTitleStyle: CSSProperties = {
  display: "block",
  fontWeight: 600,
  fontSize: "0.875rem",
  color: "#111827",
};

const rowMetaStyle: CSSProperties = {
  display: "block",
  marginTop: "0.2rem",
  fontSize: "0.75rem",
  color: "#6b7280",
};
