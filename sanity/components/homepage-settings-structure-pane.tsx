import createImageUrlBuilder from "@sanity/image-url";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Image, MutationPatch, SanityClient } from "sanity";
import { useClient, useDocumentOperation, useEditState } from "sanity";
import { usePaneRouter } from "sanity/structure";

import {
  HERO_DEFAULT_BACKGROUND_GRADIENT,
  HERO_JPEG_HINT,
} from "../../lib/hero-defaults";

import { sanityApiVersion } from "../env";

const SITE_SETTINGS_ID = "siteSettings";
const SITE_SETTINGS_TYPE = "siteSettings";

/** Matches CDN widths in lib/sanity.queries.ts */
const HERO_DESKTOP_SIZE_HINT = "1920 × 1080 px · max 500 KB";
const HERO_MOBILE_SIZE_HINT = "1080 × 1350 px · max 350 KB";
const HERO_IMAGE_ACCEPT = "image/jpeg,image/jpg,.jpg,.jpeg";

type ProjectOption = { _id: string; title: string | null; slug: string | null };

function getDisplayedDocument(
  draft: Record<string, unknown> | null | undefined,
  published: Record<string, unknown> | null | undefined,
): Record<string, unknown> | null {
  if (!draft && !published) return null;
  // Draft is the working copy. Shallow-merging published → draft breaks Remove: unset drops
  // the field on the draft, but published values would still show in the pane.
  if (draft) return draft;
  return published ?? null;
}

function imageFieldHasAsset(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const asset = (value as { asset?: unknown }).asset;
  if (!asset || typeof asset !== "object") return false;
  return "_ref" in asset || "_id" in asset;
}

function getImageAssetRef(value: unknown): string | null {
  if (!imageFieldHasAsset(value)) return null;
  const asset = (value as { asset: { _ref?: string; _id?: string } }).asset;
  return asset._ref ?? asset._id ?? null;
}

type HeroImageMeta = {
  name: string;
  width: number;
  height: number;
  sizeBytes: number;
};

type HeroImageField = "heroSectionImage" | "heroSectionImageMobile";

function formatHeroImageMetaLine(meta: HeroImageMeta): string {
  const sizeKb = Math.max(1, Math.round(meta.sizeBytes / 1024));
  const dimensions =
    meta.width > 0 && meta.height > 0 ? `${meta.width} x ${meta.height} px` : "unknown";
  return `Name: ${meta.name}, dimensions: ${dimensions}, size: ${sizeKb}kb`;
}

async function readImageDimensionsFromFile(file: File): Promise<{ width: number; height: number }> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);
      const dimensions = { width: bitmap.width, height: bitmap.height };
      bitmap.close();
      return dimensions;
    } catch {
      // Fall through to HTMLImageElement.
    }
  }

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image dimensions"));
    };
    img.src = url;
  });
}

async function readImageFileMeta(file: File): Promise<HeroImageMeta> {
  const { width, height } = await readImageDimensionsFromFile(file);
  return { name: file.name, width, height, sizeBytes: file.size };
}

type SanityAssetMetaRow = {
  originalFilename?: string | null;
  size?: number | null;
  metadata?: { dimensions?: { width?: number; height?: number } | null } | null;
};

async function fetchSanityImageAssetMeta(
  client: SanityClient,
  assetRef: string,
): Promise<HeroImageMeta | null> {
  const row = await client.fetch<SanityAssetMetaRow | null>(
    `*[_id == $id][0]{ originalFilename, size, metadata { dimensions { width, height } } }`,
    { id: assetRef },
  );
  if (!row) return null;

  const width = row.metadata?.dimensions?.width;
  const height = row.metadata?.dimensions?.height;
  const sizeBytes = row.size;
  const name = row.originalFilename?.trim();

  if (!width || !height || !sizeBytes || !name) return null;
  return { name, width, height, sizeBytes };
}

export function HomepageSettingsStructurePane() {
  const client = useClient({ apiVersion: sanityApiVersion });
  const editState = useEditState(SITE_SETTINGS_ID, SITE_SETTINGS_TYPE);
  const { patch, publish } = useDocumentOperation(SITE_SETTINGS_ID, SITE_SETTINGS_TYPE);
  const { navigateIntent } = usePaneRouter();

  const displayed = useMemo(
    () => getDisplayedDocument(editState?.draft ?? undefined, editState?.published ?? undefined),
    [editState?.draft, editState?.published],
  );

  const exists = Boolean(editState?.draft ?? editState?.published);
  const ready = editState?.ready ?? false;

  const manual = Boolean(displayed?.chooseHomepageProjectManually);
  const canPublish = publish.disabled === false;
  const refId =
    typeof displayed?.homepageFeaturedProject === "object" &&
    displayed.homepageFeaturedProject !== null &&
    "_ref" in displayed.homepageFeaturedProject
      ? String((displayed.homepageFeaturedProject as { _ref: string })._ref)
      : "";

  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [heroImageMeta, setHeroImageMeta] = useState<Record<HeroImageField, HeroImageMeta | null>>({
    heroSectionImage: null,
    heroSectionImageMobile: null,
  });

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

  const imageBuilder = useMemo(() => createImageUrlBuilder(client), [client]);

  const heroDesktop = displayed?.heroSectionImage;
  const heroMobile = displayed?.heroSectionImageMobile;
  const heroDesktopPreview = useMemo(() => {
    if (!imageFieldHasAsset(heroDesktop)) return null;
    try {
      return imageBuilder.image(heroDesktop as Image).width(520).auto("format").url();
    } catch {
      return null;
    }
  }, [heroDesktop, imageBuilder]);
  const heroMobilePreview = useMemo(() => {
    if (!imageFieldHasAsset(heroMobile)) return null;
    try {
      return imageBuilder.image(heroMobile as Image).width(360).auto("format").url();
    } catch {
      return null;
    }
  }, [heroMobile, imageBuilder]);

  useEffect(() => {
    const ref = getImageAssetRef(heroDesktop);
    if (!ref) {
      setHeroImageMeta((prev) =>
        prev.heroSectionImage ? { ...prev, heroSectionImage: null } : prev,
      );
      return;
    }

    let cancelled = false;
    void fetchSanityImageAssetMeta(client, ref).then((meta) => {
      if (!cancelled && meta) {
        setHeroImageMeta((prev) => ({ ...prev, heroSectionImage: meta }));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [client, heroDesktop]);

  useEffect(() => {
    const ref = getImageAssetRef(heroMobile);
    if (!ref) {
      setHeroImageMeta((prev) =>
        prev.heroSectionImageMobile ? { ...prev, heroSectionImageMobile: null } : prev,
      );
      return;
    }

    let cancelled = false;
    void fetchSanityImageAssetMeta(client, ref).then((meta) => {
      if (!cancelled && meta) {
        setHeroImageMeta((prev) => ({ ...prev, heroSectionImageMobile: meta }));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [client, heroMobile]);

  const uploadHeroImage = useCallback(
    async (file: File, field: HeroImageField) => {
      if (patch.disabled) return;

      try {
        const meta = await readImageFileMeta(file);
        setHeroImageMeta((prev) => ({ ...prev, [field]: meta }));
      } catch {
        setHeroImageMeta((prev) => ({
          ...prev,
          [field]: { name: file.name, width: 0, height: 0, sizeBytes: file.size },
        }));
      }

      const asset = await client.assets.upload("image", file, { filename: file.name });
      runPatch([
        {
          set: {
            [field]: {
              _type: "image",
              asset: { _type: "reference", _ref: asset._id },
            },
          },
        },
      ]);

      const width = asset.metadata?.dimensions?.width;
      const height = asset.metadata?.dimensions?.height;
      if (width && height) {
        setHeroImageMeta((prev) => ({
          ...prev,
          [field]: {
            name: asset.originalFilename ?? file.name,
            width,
            height,
            sizeBytes: asset.size ?? file.size,
          },
        }));
      }
    },
    [client, patch.disabled, runPatch],
  );

  const removeHeroImage = useCallback(
    (field: HeroImageField) => {
      if (patch.disabled) return;
      setHeroImageMeta((prev) => ({ ...prev, [field]: null }));
      runPatch([{ unset: [field] }]);
    },
    [patch.disabled, runPatch],
  );

  const handlePublish = useCallback(() => {
    if (publish.disabled) return;
    publish.execute();
  }, [publish]);

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
        <h2 style={h2}>Homepage Settings</h2>
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
      <h2 style={h2}>Hero Section Image</h2>
      <p style={body}>
        Background behind the top of the homepage. Leave empty to use the default warm stone background.
        Use a wide landscape photo (desktop) and optionally a separate crop for mobile. {HERO_JPEG_HINT}.
      </p>

      <div style={{ marginTop: 14 }}>
        <div style={labelRow}>
          <span style={labelInline}>Desktop / tablet</span>
          <span style={sizeHint}>
            {HERO_DESKTOP_SIZE_HINT} · {HERO_JPEG_HINT}
          </span>
        </div>
        {heroDesktopPreview ? (
          <img src={heroDesktopPreview} alt="" style={imagePreview} />
        ) : (
          <div style={imagePlaceholder} aria-hidden="true" />
        )}
        {imageFieldHasAsset(heroDesktop) && heroImageMeta.heroSectionImage ? (
          <p style={imageMetaLine}>{formatHeroImageMetaLine(heroImageMeta.heroSectionImage)}</p>
        ) : null}
        <div style={imageActions}>
          <label style={fileLabel}>
            {imageFieldHasAsset(heroDesktop) ? "Replace image" : "Upload image"}
            <input
              type="file"
              accept={HERO_IMAGE_ACCEPT}
              disabled={patchBlocked}
              style={hiddenFileInput}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void uploadHeroImage(file, "heroSectionImage");
                e.target.value = "";
              }}
            />
          </label>
          {imageFieldHasAsset(heroDesktop) ? (
            <button
              type="button"
              style={secondaryBtn}
              disabled={patchBlocked}
              onClick={() => removeHeroImage("heroSectionImage")}
            >
              Remove
            </button>
          ) : null}
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <div style={labelRow}>
          <span style={labelInline}>Mobile (optional)</span>
          <span style={sizeHint}>
            {HERO_MOBILE_SIZE_HINT} · {HERO_JPEG_HINT}
          </span>
        </div>
        {heroMobilePreview ? (
          <img src={heroMobilePreview} alt="" style={imagePreview} />
        ) : (
          <div style={imagePlaceholder} aria-hidden="true" />
        )}
        {imageFieldHasAsset(heroMobile) && heroImageMeta.heroSectionImageMobile ? (
          <p style={imageMetaLine}>
            {formatHeroImageMetaLine(heroImageMeta.heroSectionImageMobile)}
          </p>
        ) : null}
        <div style={imageActions}>
          <label style={fileLabel}>
            {imageFieldHasAsset(heroMobile) ? "Replace mobile image" : "Upload mobile image"}
            <input
              type="file"
              accept={HERO_IMAGE_ACCEPT}
              disabled={patchBlocked}
              style={hiddenFileInput}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void uploadHeroImage(file, "heroSectionImageMobile");
                e.target.value = "";
              }}
            />
          </label>
          {imageFieldHasAsset(heroMobile) ? (
            <button
              type="button"
              style={secondaryBtn}
              disabled={patchBlocked}
              onClick={() => removeHeroImage("heroSectionImageMobile")}
            >
              Remove
            </button>
          ) : null}
        </div>
      </div>

      <div style={sectionDivider}>
        <h2 style={h2}>Homepage Featured Project</h2>
        <p style={body}>
          Choose between the latest published project and a specific job for the homepage “From a recent
          job” block. Click Publish to update the changes.
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
      </div>

      <div style={footerActions}>
        <button
          type="button"
          style={{ ...primaryBtn, opacity: canPublish ? 1 : 0.5, cursor: canPublish ? "pointer" : "not-allowed" }}
          disabled={!canPublish}
          onClick={handlePublish}
        >
          Publish
        </button>
        {publish.disabled && typeof publish.disabled === "string" ? (
          <p style={{ ...muted, marginTop: 10 }}>
            {publish.disabled === "ALREADY_PUBLISHED"
              ? "No unpublished changes."
              : publish.disabled === "NO_CHANGES"
                ? "Save a change before publishing."
                : `Publish unavailable: ${publish.disabled}`}
          </p>
        ) : null}
        {patchBlocked ? (
          <p style={{ ...muted, marginTop: 10 }}>
            {typeof patch.disabled === "string"
              ? `Editing unavailable: ${patch.disabled}`
              : "Editing is temporarily unavailable."}
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

const labelRow: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "baseline",
  gap: "6px 10px",
  marginBottom: 4,
};

const labelInline: CSSProperties = {
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "#0f172a",
};

const sizeHint: CSSProperties = {
  fontSize: "0.75rem",
  fontWeight: 500,
  color: "#64748b",
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
  padding: "10px 20px",
  fontSize: "0.875rem",
  fontWeight: 600,
  color: "#fff",
  background: "#1d4ed8",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const sectionDivider: CSSProperties = {
  marginTop: 28,
  paddingTop: 22,
  borderTop: "1px solid #e2e8f0",
};

const imagePreview: CSSProperties = {
  display: "block",
  marginTop: 10,
  marginBottom: 4,
  width: "100%",
  maxHeight: 160,
  objectFit: "cover",
  borderRadius: 8,
  border: "1px solid #e2e8f0",
};

const imageMetaLine: CSSProperties = {
  margin: "0 0 10px",
  fontSize: "0.75rem",
  lineHeight: 1.45,
  color: "#475569",
};

const imagePlaceholder: CSSProperties = {
  marginTop: 10,
  marginBottom: 10,
  width: "100%",
  height: 120,
  borderRadius: 8,
  border: "1px dashed #cbd5e1",
  background: HERO_DEFAULT_BACKGROUND_GRADIENT,
};

const imageActions: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  alignItems: "center",
};

const fileLabel: CSSProperties = {
  display: "inline-block",
  padding: "8px 14px",
  fontSize: "0.8125rem",
  fontWeight: 500,
  color: "#1e293b",
  background: "#fff",
  border: "1px solid #cbd5e1",
  borderRadius: 6,
  cursor: "pointer",
};

const hiddenFileInput: CSSProperties = {
  display: "none",
};

const secondaryBtn: CSSProperties = {
  padding: "8px 14px",
  fontSize: "0.8125rem",
  fontWeight: 500,
  color: "#b91c1c",
  background: "#fff",
  border: "1px solid #fecaca",
  borderRadius: 6,
  cursor: "pointer",
};

const footerActions: CSSProperties = {
  marginTop: 24,
  paddingTop: 16,
  borderTop: "1px solid #e2e8f0",
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
