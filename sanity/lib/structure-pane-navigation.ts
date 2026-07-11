import type { RouterPanes } from "sanity/structure";

import { TESTIMONIAL_PENDING_EDIT_LIST_ITEM_ID, TESTIMONIAL_PUBLISHED_EDIT_LIST_ITEM_ID, TESTIMONIAL_DISCARDED_EDIT_LIST_ITEM_ID } from "../structurePaneIds";
import { isDocumentTypeListPaneId, isStructurePaneId } from "./structure-pane-ids";

export function paneBaseId(id: string): string {
  return id.split(",")[0] ?? id;
}

export function isDocumentPaneId(id: string): boolean {
  const baseId = paneBaseId(id);
  return !isStructurePaneId(baseId) && !isDocumentTypeListPaneId(baseId);
}

/** Deepest open document pane id in the current Structure router state. */
export function findOpenDocumentPaneId(panes: RouterPanes | undefined): string | null {
  if (!Array.isArray(panes) || panes.length === 0) {
    return null;
  }

  for (let groupIndex = panes.length - 1; groupIndex >= 0; groupIndex -= 1) {
    const group = panes[groupIndex];
    for (let paneIndex = group.length - 1; paneIndex >= 0; paneIndex -= 1) {
      const paneId = group[paneIndex]?.id;
      if (typeof paneId === "string" && isDocumentPaneId(paneId)) {
        return paneId;
      }
    }
  }

  return null;
}

/** Remove the deepest document pane while keeping parent list panes intact. */
export function buildPanesWithoutDocument(panes: RouterPanes): RouterPanes | null {
  const next: RouterPanes = panes.map((group) => group.map((pane) => ({ ...pane })));

  for (let groupIndex = next.length - 1; groupIndex >= 0; groupIndex -= 1) {
    const group = next[groupIndex];
    for (let paneIndex = group.length - 1; paneIndex >= 0; paneIndex -= 1) {
      const paneId = group[paneIndex]?.id;
      if (typeof paneId !== "string" || !isDocumentPaneId(paneId)) {
        continue;
      }

      group.splice(paneIndex, 1);
      if (group.length === 0) {
        next.splice(groupIndex, 1);
      }

      return next;
    }
  }

  return null;
}

function isPendingEditPaneId(id: string): boolean {
  const baseId = paneBaseId(id);
  return (
    baseId === TESTIMONIAL_PENDING_EDIT_LIST_ITEM_ID ||
    baseId === `${TESTIMONIAL_PENDING_EDIT_LIST_ITEM_ID}Pane`
  );
}

/** Remove the pending edit pane opened from the submissions queue. */
export function buildPanesWithoutPendingEdit(panes: RouterPanes): RouterPanes | null {
  const next: RouterPanes = panes.map((group) => group.map((pane) => ({ ...pane })));

  for (let groupIndex = next.length - 1; groupIndex >= 0; groupIndex -= 1) {
    const group = next[groupIndex];
    for (let paneIndex = group.length - 1; paneIndex >= 0; paneIndex -= 1) {
      const paneId = group[paneIndex]?.id;
      if (typeof paneId !== "string" || !isPendingEditPaneId(paneId)) {
        continue;
      }

      group.splice(paneIndex, 1);
      if (group.length === 0) {
        next.splice(groupIndex, 1);
      }

      return next;
    }
  }

  return null;
}

function isPublishedEditPaneId(id: string): boolean {
  const baseId = paneBaseId(id);
  return (
    baseId === TESTIMONIAL_PUBLISHED_EDIT_LIST_ITEM_ID ||
    baseId === `${TESTIMONIAL_PUBLISHED_EDIT_LIST_ITEM_ID}Pane`
  );
}

/** Remove the published edit pane opened from the published list. */
export function buildPanesWithoutPublishedEdit(panes: RouterPanes): RouterPanes | null {
  const next: RouterPanes = panes.map((group) => group.map((pane) => ({ ...pane })));

  for (let groupIndex = next.length - 1; groupIndex >= 0; groupIndex -= 1) {
    const group = next[groupIndex];
    for (let paneIndex = group.length - 1; paneIndex >= 0; paneIndex -= 1) {
      const paneId = group[paneIndex]?.id;
      if (typeof paneId !== "string" || !isPublishedEditPaneId(paneId)) {
        continue;
      }

      group.splice(paneIndex, 1);
      if (group.length === 0) {
        next.splice(groupIndex, 1);
      }

      return next;
    }
  }

  return null;
}

function isDiscardedEditPaneId(id: string): boolean {
  const baseId = paneBaseId(id);
  return (
    baseId === TESTIMONIAL_DISCARDED_EDIT_LIST_ITEM_ID ||
    baseId === `${TESTIMONIAL_DISCARDED_EDIT_LIST_ITEM_ID}Pane`
  );
}

/** Remove the discarded edit pane opened from the discarded list. */
export function buildPanesWithoutDiscardedEdit(panes: RouterPanes): RouterPanes | null {
  const next: RouterPanes = panes.map((group) => group.map((pane) => ({ ...pane })));

  for (let groupIndex = next.length - 1; groupIndex >= 0; groupIndex -= 1) {
    const group = next[groupIndex];
    for (let paneIndex = group.length - 1; paneIndex >= 0; paneIndex -= 1) {
      const paneId = group[paneIndex]?.id;
      if (typeof paneId !== "string" || !isDiscardedEditPaneId(paneId)) {
        continue;
      }

      group.splice(paneIndex, 1);
      if (group.length === 0) {
        next.splice(groupIndex, 1);
      }

      return next;
    }
  }

  return null;
}
