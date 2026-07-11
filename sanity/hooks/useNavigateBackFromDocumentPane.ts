import { useCallback } from "react";
import { useRouter, useRouterState } from "sanity/router";
import type { RouterPanes } from "sanity/structure";

import { buildPanesWithoutDocument } from "../lib/structure-pane-navigation";

export function useNavigateBackFromDocumentPane() {
  const router = useRouter();
  const panes = useRouterState((state) => state.panes as RouterPanes | undefined);

  return useCallback(() => {
    if (!Array.isArray(panes) || panes.length === 0) {
      return;
    }

    const nextPanes = buildPanesWithoutDocument(panes);
    if (!nextPanes) {
      return;
    }

    router.navigate({ panes: nextPanes }, { replace: true });
  }, [panes, router]);
}
