"use client";

import { useEffect } from "react";
import { useClient } from "sanity";
import { useRouterState } from "sanity/router";
import type { RouterPanes } from "sanity/structure";

import { sanityApiVersion } from "../env";
import { useNavigateBackFromDocumentPane } from "../hooks/useNavigateBackFromDocumentPane";
import { findOpenDocumentPaneId } from "../lib/structure-pane-navigation";

/**
 * If Structure opens a testimonial document pane for an id that no longer exists
 * (e.g. after permanent delete + refresh), return to the parent list.
 */
export function DeletedTestimonialPaneRedirect() {
  const client = useClient({ apiVersion: sanityApiVersion });
  const panes = useRouterState((state) => state.panes as RouterPanes | undefined);
  const navigateBack = useNavigateBackFromDocumentPane();

  useEffect(() => {
    const documentPaneId = findOpenDocumentPaneId(panes);
    if (!documentPaneId || documentPaneId.startsWith("drafts.")) {
      return undefined;
    }

    let cancelled = false;

    void client
      .fetch<{ _type?: string } | null>(`*[_id == $id][0]{ _type }`, { id: documentPaneId })
      .then((document) => {
        if (cancelled || document?._type !== "testimonial") {
          return;
        }

        return client.fetch<boolean>(`!defined(*[_id == $id][0]._id)`, { id: documentPaneId });
      })
      .then((isMissing) => {
        if (cancelled || !isMissing) {
          return;
        }

        navigateBack();
      })
      .catch((error: unknown) => {
        console.error(error);
      });

    return () => {
      cancelled = true;
    };
  }, [client, navigateBack, panes]);

  return null;
}
