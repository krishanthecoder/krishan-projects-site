import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useToast } from "@sanity/ui";
import { useClient } from "sanity";
import { usePaneRouter } from "sanity/structure";

import { sanityApiVersion } from "../env";
import {
  TestimonialStarPicker,
  testimonialFieldLabelStyle,
  testimonialInputStyle,
  testimonialReadOnlyInputStyle,
  testimonialReadOnlyTextareaStyle,
  testimonialTextareaStyle,
} from "./testimonial-form-fields";
import { useClosePublishedEditPane } from "../hooks/useClosePublishedEditPane";
import { commitTestimonialWorkflow } from "../lib/testimonial-workflow";
import {
  studioDisabledPrimaryButtonStyle,
  studioPublishButtonStyle,
} from "../styles/publish-button";

type PublishedEditPayload = {
  documentId?: string;
};

type PublishedReview = {
  _id: string;
  clientName: string;
  jobTitle: string;
  rating: number;
  content: string;
};

type ReviewFormValues = Omit<PublishedReview, "_id">;

const reviewQuery = `*[_type == "testimonial" && !(_id in path("drafts.**")) && _id == $id && (!defined(status) || status == "published")][0]{
  _id,
  clientName,
  jobTitle,
  rating,
  content
}`;

function valuesFromReview(review: PublishedReview): ReviewFormValues {
  return {
    clientName: review.clientName,
    jobTitle: review.jobTitle,
    rating: review.rating,
    content: review.content,
  };
}

function formsMatch(a: ReviewFormValues, b: ReviewFormValues): boolean {
  return (
    a.clientName === b.clientName &&
    a.jobTitle === b.jobTitle &&
    a.rating === b.rating &&
    a.content === b.content
  );
}

export function PublishedTestimonialEditPane() {
  const client = useClient({ apiVersion: sanityApiVersion });
  const toast = useToast();
  const closePublishedEditPane = useClosePublishedEditPane();
  const closePublishedEditPaneRef = useRef(closePublishedEditPane);
  const skipLoadRef = useRef(false);
  const closedRef = useRef(false);
  const documentId = usePublishedEditDocumentId();

  const [review, setReview] = useState<PublishedReview | null>(null);
  const [savedValues, setSavedValues] = useState<ReviewFormValues | null>(null);
  const [clientName, setClientName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  closePublishedEditPaneRef.current = closePublishedEditPane;

  const currentValues = useMemo<ReviewFormValues>(
    () => ({
      clientName,
      jobTitle,
      rating,
      content,
    }),
    [clientName, content, jobTitle, rating],
  );

  const hasChanges = savedValues ? !formsMatch(currentValues, savedValues) : false;

  const closePane = useCallback(() => {
    closePublishedEditPaneRef.current();
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
    setSavedMessage(null);

    try {
      const row = await client.fetch<PublishedReview | null>(reviewQuery, { id: documentId });
      if (!row) {
        if (!closedRef.current) {
          closedRef.current = true;
          skipLoadRef.current = true;
          closePane();
        }
        return;
      }

      const values = valuesFromReview(row);
      setReview(row);
      setSavedValues(values);
      setClientName(values.clientName);
      setJobTitle(values.jobTitle);
      setRating(values.rating);
      setContent(values.content);
      setIsEditing(false);
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

  const handleSave = useCallback(async () => {
    if (!review || !hasChanges) return;

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setBusy(true);
    setError(null);
    setSavedMessage(null);

    try {
      const nextValues: ReviewFormValues = {
        clientName: clientName.trim(),
        jobTitle: jobTitle.trim(),
        rating,
        content: content.trim(),
      };

      await commitTestimonialWorkflow(client, review._id, {
        ...nextValues,
        status: "published",
      });

      setReview({ ...review, ...nextValues });
      setSavedValues(nextValues);
      setIsEditing(false);
      setSavedMessage("Changes saved.");
    } catch (err) {
      console.error(err);
      setError("Save failed. Try again.");
    } finally {
      setBusy(false);
    }
  }, [client, clientName, content, hasChanges, jobTitle, rating, review, validate]);

  const handleDiscard = useCallback(async () => {
    if (!review || busy) return;

    setBusy(true);
    setError(null);
    skipLoadRef.current = true;
    closedRef.current = true;

    try {
      await commitTestimonialWorkflow(client, review._id, { status: "discarded" });
      toast.push({
        status: "success",
        title: "Review discarded",
        description: "It has been removed from the site and moved to Discarded.",
      });
      closePane();
    } catch (err) {
      console.error(err);
      skipLoadRef.current = false;
      closedRef.current = false;
      setError("Discard failed. Try again.");
      setBusy(false);
    }
  }, [busy, client, closePane, review, toast]);

  const handleCancelEdit = useCallback(() => {
    if (!savedValues) return;

    setClientName(savedValues.clientName);
    setJobTitle(savedValues.jobTitle);
    setRating(savedValues.rating);
    setContent(savedValues.content);
    setIsEditing(false);
    setError(null);
  }, [savedValues]);

  const fieldsDisabled = !isEditing || busy;
  const inputStyle = isEditing ? testimonialInputStyle : testimonialReadOnlyInputStyle;
  const textareaStyle = isEditing ? testimonialTextareaStyle : testimonialReadOnlyTextareaStyle;

  return (
    <div style={paneStyle}>
      <header style={headerStyle}>
        <h2 style={titleStyle}>{review?.clientName || "Published review"}</h2>
        <p style={helpStyle}>
          {isEditing
            ? "Update the review wording, then save your changes."
            : "This review is live on the website. Click Edit to make changes."}
        </p>
      </header>

      {error ? <p style={errorStyle}>{error}</p> : null}
      {savedMessage ? <p style={successStyle}>{savedMessage}</p> : null}

      {loading ? (
        <p style={helpStyle}>Loading…</p>
      ) : !review ? null : (
        <form
          style={formStyle}
          onSubmit={(event) => {
            event.preventDefault();
            void handleSave();
          }}
        >
          <label style={fieldStyle}>
            <span style={testimonialFieldLabelStyle}>Client name</span>
            <input
              type="text"
              value={clientName}
              onChange={(event) => setClientName(event.target.value)}
              style={inputStyle}
              disabled={fieldsDisabled}
              readOnly={!isEditing}
            />
          </label>

          <label style={fieldStyle}>
            <span style={testimonialFieldLabelStyle}>Rating</span>
            <TestimonialStarPicker
              value={rating}
              onChange={setRating}
              disabled={fieldsDisabled}
            />
          </label>

          <label style={fieldStyle}>
            <span style={testimonialFieldLabelStyle}>Job title</span>
            <input
              type="text"
              value={jobTitle}
              onChange={(event) => setJobTitle(event.target.value)}
              style={inputStyle}
              disabled={fieldsDisabled}
              readOnly={!isEditing}
            />
          </label>

          <label style={fieldStyle}>
            <span style={testimonialFieldLabelStyle}>Review</span>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={6}
              style={textareaStyle}
              disabled={fieldsDisabled}
              readOnly={!isEditing}
            />
          </label>

          <div style={footerStyle}>
            {isEditing ? (
              <>
                <button
                  type="submit"
                  style={hasChanges ? studioPublishButtonStyle : studioDisabledPrimaryButtonStyle}
                  disabled={busy || !hasChanges}
                >
                  Save
                </button>
                <button
                  type="button"
                  style={secondaryButtonStyle}
                  disabled={busy}
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  style={studioPublishButtonStyle}
                  disabled={busy}
                  onClick={() => {
                    setSavedMessage(null);
                    setIsEditing(true);
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  style={discardButtonStyle}
                  disabled={busy}
                  onClick={() => void handleDiscard()}
                >
                  Discard
                </button>
              </>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

function usePublishedEditDocumentId(): string | undefined {
  const { payload } = usePaneRouter();
  return (payload as PublishedEditPayload | undefined)?.documentId;
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

const successStyle: CSSProperties = {
  marginBottom: "1rem",
  color: "#166534",
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

const footerStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.75rem",
  marginTop: "auto",
  paddingTop: "1.5rem",
  borderTop: "1px solid #e5e7eb",
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

const discardButtonStyle: CSSProperties = {
  ...secondaryButtonStyle,
  color: "#b91c1c",
  borderColor: "#fecaca",
};
