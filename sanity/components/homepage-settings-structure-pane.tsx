import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { MutationPatch } from "sanity";
import { useClient, useDocumentOperation, useEditState } from "sanity";
import { usePaneRouter } from "sanity/structure";

import { sanityApiVersion } from "../env";

const SITE_SETTINGS_ID = "siteSettings";
const SITE_SETTINGS_TYPE = "siteSettings";

type ProjectOption = { _id: string; title: string | null; slug: string | null };

function mergeDisplayed(
  draft: Record<string, unknown> | null | undefined,
  published: Record<string, unknown> | null | undefined,
): Record<string, unknown> | null {
  if (!draft && !published) return null;
  return { ...(published ?? {}), ...(draft ?? {}) };
}

export function HomepageSettingsStructurePane() {
  const client = useClient({ apiVersion: sanityApiVersion });
  const editState = useEditState(SITE_SETTINGS_ID, SITE_SETTINGS_TYPE);
  const { patch } = useDocumentOperation(SITE_SETTINGS_ID, SITE_SETTINGS_TYPE);
  const { navigateIntent } = usePaneRouter();

  const displayed = useMemo(
    () => mergeDisplayed(editState?.draft ?? undefined, editState?.published ?? undefined),
    [editState?.draft, editState?.published],
  );

  const exists = Boolean(editState?.draft ?? editState?.published);
  const ready = editState?.ready ?? false;

  const manual = Boolean(displayed?.chooseHomepageProjectManually);
  const refId =
    typeof displayed?.homepageFeaturedProject === "object" &&
    displayed.homepageFeaturedProject !== null &&
    "_ref" in displayed.homepageFeaturedProject
      ? String((displayed.homepageFeaturedProject as { _ref: string })._ref)
      : "";

  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  useEffect(() => {
    if (!manual) return;
    let cancelled = false;
    async function load() {
      setProjectsLoading(true);
      try {
        const rows = await client.fetch<ProjectOption[]>(
          `*[_type == "project" && defined(slug.current)] | order(coalesce(_updatedAt, _createdAt) desc) [0...80] { _id, title, "slug": slug.current }`,
        );
        if (!cancelled) setProjects(rows ?? []);
      } finally {
        if (!cancelled) setProjectsLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [client, manual]);

  const runPatch = useCallback(
    (patches: MutationPatch[]) => {
      if (patch.disabled) return;
      patch.execute(patches);
    },
    [patch],
  );

  const setManual = useCallback(
    (next: boolean) => {
      runPatch([{ set: { chooseHomepageProjectManually: next } }]);
    },
    [runPatch],
  );

  const setFeaturedRef = useCallback(
    (nextId: string) => {
      if (!nextId) {
        runPatch([{ unset: ["homepageFeaturedProject"] }]);
        return;
      }
      runPatch([
        {
          set: {
            homepageFeaturedProject: { _type: "reference", _ref: nextId },
          },
        },
      ]);
    },
    [runPatch],
  );

  const openFullDocument = useCallback(() => {
    navigateIntent("edit", { type: SITE_SETTINGS_TYPE, id: SITE_SETTINGS_ID });
  }, [navigateIntent]);

  const createDocument = useCallback(() => {
    navigateIntent("create", { type: SITE_SETTINGS_TYPE, id: SITE_SETTINGS_ID });
  }, [navigateIntent]);

  if (!ready) {
    return (
      <div style={paneWrap}>
        <p style={muted}>Loading homepage settings…</p>
      </div>
    );
  }

  if (!exists) {
    return (
      <div style={paneWrap}>
        <h2 style={h2}>Homepage settings</h2>
        <p style={body}>
          Create the single homepage settings document to control whether the site shows your latest
          project automatically or a hand-picked featured project.
        </p>
        <button type="button" style={primaryBtn} onClick={createDocument}>
          Create homepage settings
        </button>
      </div>
    );
  }

  const patchBlocked = patch.disabled !== false;

  return (
    <div style={paneWrap}>
      <h2 style={h2}>Homepage settings</h2>
      <p style={body}>
        Use the switch to choose between the latest published project and a specific job for the
        homepage hero and “From a recent job” block. Publish this document after changes when you
        are ready for them to go live.
      </p>

      <div style={row}>
        <div style={{ flex: 1 }}>
          <div style={label}>Pick homepage project manually</div>
          <div style={help}>Off = always use the project you published most recently.</div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={manual}
          disabled={patchBlocked}
          onClick={() => setManual(!manual)}
          style={toggleTrack(manual, patchBlocked)}
        >
          <span style={toggleThumb(manual)} />
        </button>
      </div>

      {manual ? (
        <div style={{ marginTop: 20 }}>
          <label htmlFor="homepage-featured-project" style={label}>
            Featured project
          </label>
          <div style={help}>Choose a published project with a featured image or gallery photos.</div>
          <select
            id="homepage-featured-project"
            value={refId}
            disabled={patchBlocked || projectsLoading}
            onChange={(e) => setFeaturedRef(e.target.value)}
            style={selectStyle}
          >
            <option value="">Select a project…</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {(p.title?.trim() || "Untitled") + (p.slug ? ` (${p.slug})` : "")}
              </option>
            ))}
          </select>
          {projectsLoading ? <p style={{ ...muted, marginTop: 8 }}>Loading projects…</p> : null}
        </div>
      ) : null}

      <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #e2e8f0" }}>
        <button type="button" style={ghostBtn} onClick={openFullDocument}>
          Open full document editor
        </button>
        {patchBlocked ? (
          <p style={{ ...muted, marginTop: 10 }}>
            {typeof patch.disabled === "string"
              ? `Changes are unavailable: ${patch.disabled}`
              : "Changes are temporarily unavailable."}
          </p>
        ) : null}
      </div>
    </div>
  );
}

const paneWrap: CSSProperties = {
  padding: "1.25rem",
  maxWidth: 520,
  fontFamily:
    'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const h2: CSSProperties = {
  margin: "0 0 0.5rem",
  fontSize: "1.05rem",
  fontWeight: 600,
  color: "#0f172a",
};

const body: CSSProperties = {
  margin: "0 0 1.25rem",
  fontSize: "0.875rem",
  lineHeight: 1.5,
  color: "#334155",
};

const muted: CSSProperties = {
  margin: 0,
  fontSize: "0.8125rem",
  color: "#64748b",
};

const label: CSSProperties = {
  display: "block",
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "#0f172a",
  marginBottom: 4,
};

const help: CSSProperties = {
  fontSize: "0.75rem",
  color: "#64748b",
  lineHeight: 1.45,
};

const row: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 16,
  padding: "14px 16px",
  borderRadius: 8,
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
};

const selectStyle: CSSProperties = {
  marginTop: 10,
  width: "100%",
  maxWidth: "100%",
  fontSize: "0.875rem",
  padding: "10px 12px",
  borderRadius: 6,
  border: "1px solid #cbd5e1",
  background: "#fff",
  color: "#0f172a",
};

const primaryBtn: CSSProperties = {
  marginTop: 8,
  padding: "10px 16px",
  fontSize: "0.875rem",
  fontWeight: 600,
  color: "#fff",
  background: "#1d4ed8",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const ghostBtn: CSSProperties = {
  padding: "8px 12px",
  fontSize: "0.8125rem",
  fontWeight: 500,
  color: "#1e293b",
  background: "#fff",
  border: "1px solid #cbd5e1",
  borderRadius: 6,
  cursor: "pointer",
};

function toggleTrack(on: boolean, disabled: boolean): CSSProperties {
  return {
    position: "relative",
    width: 44,
    height: 26,
    flexShrink: 0,
    borderRadius: 999,
    border: "none",
    padding: 0,
    cursor: disabled ? "not-allowed" : "pointer",
    background: on ? "#2563eb" : "#cbd5e1",
    opacity: disabled ? 0.5 : 1,
    transition: "background 0.15s ease",
  };
}

function toggleThumb(on: boolean): CSSProperties {
  return {
    position: "absolute",
    top: 3,
    left: on ? 22 : 3,
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "#fff",
    boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
    transition: "left 0.15s ease",
    pointerEvents: "none",
    display: "block",
  };
}
