import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@sanity/ui";
import { useClient } from "sanity";
import { usePaneRouter } from "sanity/structure";

import { sanityApiVersion } from "../env";
import { useClosePendingEditPane } from "../hooks/useClosePendingEditPane";
import { commitTestimonialWorkflow } from "../lib/testimonial-workflow";
import { studioPublishButtonStyle } from "../styles/publish-button";

type PendingEditPayload = {
  documentId?: string;
};

type PendingReview = {
  _id: string;
  clientName: string;
  jobTitle: string;
  rating: number;
  content: string;
};

const reviewQuery = `*[_type == "testimonial" && !(_id in path("drafts.**")) && _id == $id && status == "pending"][0]{
  _id,
  clientName,
  jobTitle,
  rating,
  content
}`;

function StarPicker({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}) {
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

export function PendingTestimonialEditPane() {
  const client = useClient({ apiVersion: sanityApiVersion });
  const toast = useToast();
  const closePendingEditPane = useClosePendingEditPane();
  const closePendingEditPaneRef = useRef(closePendingEditPane);
  const skipLoadRef = useRef(false);
  const closedRef = useRef(false);
  const documentId = usePendingEditDocumentId();

  const [review, setReview] = useState<PendingReview | null>(null);
  const [clientName, setClientName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  closePendingEditPaneRef.current = closePendingEditPane;

  const closePane = useCallback(() => {
    closePendingEditPaneRef.current();
  }, []);

  const loadReview = useCallback(async () => {
    if (skipLoadRef.current || closedRef.current) {
      return;
    }

    if (!documentId) {
      setError("No review selected.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const row = await client.fetch<PendingReview | null>(reviewQuery, { id: documentId });
      if (!row) {
        if (!closedRef.current) {
          closedRef.current = true;
          skipLoadRef.current = true;
          closePane();
        }
        return;
      }

      setReview(row);
      setClientName(row.clientName);
      setJobTitle(row.jobTitle);
      setRating(row.rating);
      setContent(row.content);
    } catch (err) {
      console.error(err);
      setError("Could not load this review.");
    } finally {
      setLoading(false);
    }
  }, [client, closePane, documentId]);

  useEffect(() => {
    skipLoadRef.current = false;
    closedRef.current = false;
  }, [documentId]);

  useEffect(() => {
    void loadReview();
  }, [documentId, loadReview]);

  const validate = useCallback(() => {
    if (!clientName.trim()) return "Please enter the client name.";
    if (jobTitle.trim().length < 5) return "Please describe the job (at least 5 characters).";
    if (rating < 1 || rating > 5) return "Please select a star rating.";
    if (content.trim().length < 10) {
      return "Please write a little more about the experience (at least 10 characters).";
    }
    return null;
  }, [clientName, content, jobTitle, rating]);

  const saveReview = useCallback(
    async (status: "published" | "discarded") => {
      if (!review) return;

      const validationError = status === "published" ? validate() : null;
      if (validationError) {
        setError(validationError);
        return;
      }

      setBusy(true);
      setError(null);
      skipLoadRef.current = true;
      closedRef.current = true;

      try {
        await commitTestimonialWorkflow(client, review._id, {
          clientName: clientName.trim(),
          jobTitle: jobTitle.trim(),
          rating,
          content: content.trim(),
          status,
        });

        if (status === "published") {
          toast.push({
            status: "success",
            title: "Review published",
            description: "This review is now live on the website under Published on site.",
          });
        } else {
          toast.push({
            status: "success",
            title: "Review discarded",
            description: "It has been moved to Discarded and will not appear on the site.",
          });
        }

        closePane();
      } catch (err) {
        console.error(err);
        skipLoadRef.current = false;
        closedRef.current = false;
        setError(status === "published" ? "Publish failed. Try again." : "Discard failed. Try again.");
        setBusy(false);
      }
    },
    [client, clientName, closePane, content, jobTitle, rating, review, toast, validate],
  );

  return (
    <div style={paneStyle}>
      <header style={headerStyle}>
        <h2 style={titleStyle}>Edit review</h2>
        <p style={helpStyle}>
          Update the wording if needed, then publish to the site or discard the submission.
        </p>
      </header>

      {error ? <p style={errorStyle}>{error}</p> : null}

      {loading ? (
        <p style={helpStyle}>Loading…</p>
      ) : !review ? null : (
        <form
          style={formStyle}
          onSubmit={(event) => {
            event.preventDefault();
            void saveReview("published");
          }}
        >
          <label style={fieldStyle}>
            <span style={labelStyle}>Client name</span>
            <input
              type="text"
              value={clientName}
              onChange={(event) => setClientName(event.target.value)}
              style={inputStyle}
              disabled={busy}
            />
          </label>

          <label style={fieldStyle}>
            <span style={labelStyle}>Rating</span>
            <StarPicker value={rating} onChange={setRating} disabled={busy} />
          </label>

          <label style={fieldStyle}>
            <span style={labelStyle}>Job title</span>
            <input
              type="text"
              value={jobTitle}
              onChange={(event) => setJobTitle(event.target.value)}
              style={inputStyle}
              disabled={busy}
            />
          </label>

          <label style={fieldStyle}>
            <span style={labelStyle}>Review</span>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={6}
              style={textareaStyle}
              disabled={busy}
            />
          </label>

          <div style={footerStyle}>
            <button type="submit" style={studioPublishButtonStyle} disabled={busy}>
              Publish to the site
            </button>
            <button
              type="button"
              style={discardButtonStyle}
              disabled={busy}
              onClick={() => void saveReview("discarded")}
            >
              Discard
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function usePendingEditDocumentId(): string | undefined {
  const { payload } = usePaneRouter();
  return (payload as PendingEditPayload | undefined)?.documentId;
}

const paneStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100%",
  padding: "1.5rem",
  boxSizing: "border-box",
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

const formStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1.25rem",
  flex: 1,
};

const fieldStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
};

const labelStyle: CSSProperties = {
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "#374151",
};

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "0.625rem 0.75rem",
  borderRadius: "0.375rem",
  border: "1px solid #d1d5db",
  fontSize: "0.875rem",
};

const textareaStyle: CSSProperties = {
  ...inputStyle,
  resize: "vertical",
  minHeight: "8rem",
  lineHeight: 1.55,
};

const ratingHelpStyle: CSSProperties = {
  margin: "0.5rem 0 0",
  fontSize: "0.8rem",
  color: "#6b7280",
};

const footerStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.75rem",
  marginTop: "auto",
  paddingTop: "1.5rem",
  borderTop: "1px solid #e5e7eb",
};

const discardButtonStyle: CSSProperties = {
  minHeight: "40px",
  padding: "10px 16px",
  borderRadius: "0.375rem",
  border: "1px solid #fecaca",
  background: "#fff",
  color: "#b91c1c",
  fontWeight: 600,
  fontSize: "0.875rem",
  cursor: "pointer",
};
