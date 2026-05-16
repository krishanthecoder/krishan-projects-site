"use client";

import { useEffect, useRef } from "react";
import { useRouter, useRouterState } from "sanity/router";

import {
  DEFAULT_STRUCTURE_PANES,
  STUDIO_ENTRY_PATH_STORAGE_KEY,
} from "../structurePaneIds";

function isBareStructurePath(pathname: string) {
  return pathname === "/studio/structure" || pathname === "/studio/structure/";
}

function isStudioRootPath(pathname: string) {
  return pathname === "/studio" || pathname === "/studio/";
}

function getStudioEntryPath(): string | null {
  try {
    return sessionStorage.getItem(STUDIO_ENTRY_PATH_STORAGE_KEY);
  } catch {
    return null;
  }
}

function shouldAutoOpenHomepageSettings(): boolean {
  const entryPath = getStudioEntryPath();
  const currentPath = window.location.pathname;

  if (isStudioRootPath(entryPath ?? "")) {
    return false;
  }

  return isBareStructurePath(currentPath);
}

/**
 * Opens Homepage Settings when Structure loads with no pane selected.
 * Must run inside the Structure tool router (not the Studio root layout).
 */
export function DefaultHomepageStructureNavigation() {
  const router = useRouter();
  const panes = useRouterState((state) => state.panes);
  const intent = useRouterState((state) => state.intent);
  const didNavigateRef = useRef(false);

  useEffect(() => {
    if (didNavigateRef.current) {
      return;
    }

    if (intent) {
      return;
    }

    if (Array.isArray(panes) && panes.length > 0) {
      return;
    }

    if (!shouldAutoOpenHomepageSettings()) {
      return;
    }

    didNavigateRef.current = true;
    router.navigate(
      { panes: DEFAULT_STRUCTURE_PANES.map((group) => [...group]) },
      { replace: true },
    );
  }, [intent, panes, router]);

  return null;
}
