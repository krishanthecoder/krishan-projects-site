import type { CSSProperties } from "react";
import { useCallback, useEffect, useState } from "react";
import type { SanityClient } from "sanity";
import { useClient } from "sanity";
import { usePaneRouter } from "sanity/structure";

import { sanityApiVersion } from "../env";
import {
  TESTIMONIAL_PENDING_EDIT_LIST_ITEM_ID,
} from "../structurePaneIds";
import { useTestimonialMutationRefresh } from "../hooks/useTestimonialMutationRefresh";
import {
  commitTestimonialWorkflow,
  repairStaleTestimonialDrafts,
  TESTIMONIAL_WORKFLOW_CHANGED_EVENT,
  type TestimonialWorkflowChangedDetail,
} from "../lib/testimonial-workflow";
import { studioPublishButtonStyle } from "../styles/publish-button";
import { TestimonialStarRating } from "./testimonial-form-fields";

type PendingTestimonial = {
  _id: string;
  clientName: string;
  jobTitle: string;
  rating: number;
  content: string;
  createdAt?: string;
};

const pendingQuery = `*[_type == "testimonial" && !(_id in path("drafts.**")) && status == "pending"] | order(_createdAt desc){
  _id,
  clientName,
  jobTitle,
  rating,
  content,
  "createdAt": _createdAt
}`;

function formatPostedDate(value?: string) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

async function setTestimonialStatus(
  client: SanityClient,
  id: string,
  status: "published" | "discarded",
) {
  await commitTestimonialWorkflow(client, id, { status });
}

export function TestimonialSubmissionsPane() {
  const client = useClient({ apiVersion: sanityApiVersion });
  const { ChildLink } = usePaneRouter();
  const [rows, setRows] = useState<PendingTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadPending = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setLoading(true);
    }
    setError(null);
    try {
      await repairStaleTestimonialDrafts(client);
      const next = await client.fetch<PendingTestimonial[]>(pendingQuery);
      setRows(next);
    } catch (err) {
      console.error(err);
      setError("Could not load pending reviews.");
    } finally {
      if (!options?.silent) {
        setLoading(false);
      }
    }
  }, [client]);

  useEffect(() => {
    void loadPending();
  }, [loadPending]);

  useTestimonialMutationRefresh(() => {
    void loadPending({ silent: true });
  });

  useEffect(() => {
    const onWorkflowChanged = (event: Event) => {
      const detail = (event as CustomEvent<TestimonialWorkflowChangedDetail>).detail;
      if (
        detail?.documentId &&
        (detail.status === "discarded" || detail.status === "published")
      ) {
        setRows((current) => current.filter((row) => row._id !== detail.documentId));
      }
    };

    window.addEventListener(TESTIMONIAL_WORKFLOW_CHANGED_EVENT, onWorkflowChanged);
    return () => {
      window.removeEventListener(TESTIMONIAL_WORKFLOW_CHANGED_EVENT, onWorkflowChanged);
    };
  }, []);

  const handlePublish = useCallback(
    async (id: string) => {
      setBusyId(id);
      try {
        await setTestimonialStatus(client, id, "published");
        await loadPending();
      } catch (err) {
        console.error(err);
        setError("Publish failed. Try again.");
      } finally {
        setBusyId(null);
      }
    },
    [client, loadPending],
  );

  const handleDiscard = useCallback(
    async (id: string) => {
      setBusyId(id);
      try {
        await setTestimonialStatus(client, id, "discarded");
        await loadPending();
      } catch (err) {
        console.error(err);
        setError("Discard failed. Try again.");
      } finally {
        setBusyId(null);
      }
    },
    [client, loadPending],
  );

  return (
    <div style={paneStyle}>
      <header style={headerStyle}>
        <h2 style={titleStyle}>Pending submissions</h2>
        <p style={helpStyle}>
          Reviews from <code>/leave-a-review</code> land here first. Publish to add them to the
          site, use Edit to update wording, or Discard to hide them. Published and imported reviews live
          under <strong>Published on site</strong>.
        </p>
      </header>

      {error ? <p style={errorStyle}>{error}</p> : null}

      {loading ? (
        <p style={helpStyle}>Loading…</p>
      ) : rows.length === 0 ? (
        <div style={emptyStyle}>
          <p style={emptyTitleStyle}>No pending reviews</p>
          <p style={helpStyle}>
            New submissions from <code>/leave-a-review</code> will appear here.
          </p>
        </div>
      ) : (
        <ul style={listStyle}>
          {rows.map((row) => {
            const posted = formatPostedDate(row.createdAt);
            const isBusy = busyId === row._id;

            return (
              <li key={row._id} style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <div>
                    <p style={nameStyle}>{row.clientName}</p>
                    <div style={metaRowStyle}>
                      <span style={metaStyle}>{row.jobTitle}</span>
                      <TestimonialStarRating value={row.rating} />
                      {posted ? <span style={metaStyle}>{posted}</span> : null}
                    </div>
                  </div>
                </div>
                <p style={contentStyle}>{row.content}</p>
                <div style={actionsStyle}>
                  <button
                    type="button"
                    style={studioPublishButtonStyle}
                    disabled={isBusy}
                    onClick={() => void handlePublish(row._id)}
                  >
                    Publish
                  </button>
                  <ChildLink
                    childId={TESTIMONIAL_PENDING_EDIT_LIST_ITEM_ID}
                    childPayload={{ documentId: row._id }}
                  >
                    <button type="button" style={secondaryButtonStyle} disabled={isBusy}>
                      Edit
                    </button>
                  </ChildLink>
                  <button
                    type="button"
                    style={dangerButtonStyle}
                    disabled={isBusy}
                    onClick={() => void handleDiscard(row._id)}
                  >
                    Discard
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const paneStyle: CSSProperties = {
  padding: "1.5rem",
  maxWidth: "48rem",
};

const headerStyle: CSSProperties = {
  marginBottom: "1.5rem",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: "1.25rem",
  fontWeight: 700,
};

const helpStyle: CSSProperties = {
  margin: "0.5rem 0 0",
  fontSize: "0.875rem",
  lineHeight: 1.5,
  color: "#4b5563",
};

const errorStyle: CSSProperties = {
  marginBottom: "1rem",
  color: "#b91c1c",
  fontSize: "0.875rem",
  fontWeight: 600,
};

const emptyStyle: CSSProperties = {
  border: "1px dashed #d1d5db",
  borderRadius: "0.75rem",
  padding: "1.5rem",
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
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const cardStyle: CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "0.75rem",
  padding: "1rem 1.25rem",
  background: "#fff",
};

const cardHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "1rem",
};

const nameStyle: CSSProperties = {
  margin: 0,
  fontWeight: 700,
  fontSize: "1rem",
};

const metaStyle: CSSProperties = {
  fontSize: "0.8125rem",
  color: "#6b7280",
};

const metaRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "0.5rem",
  marginTop: "0.25rem",
};

const contentStyle: CSSProperties = {
  margin: "0.75rem 0 0",
  fontSize: "0.875rem",
  lineHeight: 1.55,
  color: "#374151",
  whiteSpace: "pre-wrap",
};

const actionsStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
  marginTop: "1rem",
};

const secondaryButtonStyle: CSSProperties = {
  minHeight: "40px",
  padding: "10px 16px",
  borderRadius: "0.375rem",
  border: "1px solid #d1d5db",
  background: "#fff",
  color: "#111827",
  fontWeight: 600,
  fontSize: "0.875rem",
  cursor: "pointer",
};

const dangerButtonStyle: CSSProperties = {
  ...secondaryButtonStyle,
  color: "#b91c1c",
  borderColor: "#fecaca",
};
