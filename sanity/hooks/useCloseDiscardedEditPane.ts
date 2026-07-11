import { useCallback, useRef } from "react";
import { useRouter, useRouterState } from "sanity/router";
import type { RouterPanes } from "sanity/structure";
import { usePaneRouter } from "sanity/structure";

import { buildPanesWithoutDiscardedEdit } from "../lib/structure-pane-navigation";

export function useCloseDiscardedEditPane() {
  const router = useRouter();
  const panes = useRouterState((state) => state.panes as RouterPanes | undefined);
  const panesRef = useRef(panes);
  const { closeCurrent } = usePaneRouter();
  const isClosingRef = useRef(false);

  panesRef.current = panes;

  return useCallback(() => {
    if (isClosingRef.current) {
      return;
    }

    isClosingRef.current = true;
    closeCurrent();

    const currentPanes = panesRef.current;
    if (!Array.isArray(currentPanes) || currentPanes.length === 0) {
      isClosingRef.current = false;
      return;
    }

    const nextPanes = buildPanesWithoutDiscardedEdit(currentPanes);
    if (!nextPanes) {
      isClosingRef.current = false;
      return;
    }

    window.setTimeout(() => {
      router.navigate({ panes: nextPanes }, { replace: true });
      isClosingRef.current = false;
    }, 0);
  }, [closeCurrent, router]);
}
