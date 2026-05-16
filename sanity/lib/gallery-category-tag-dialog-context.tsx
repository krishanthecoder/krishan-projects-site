"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
type GalleryCategoryTagDialogContextValue = {
  markAddConfirmed: () => void;
  wasAddConfirmed: () => boolean;
  resetAddConfirmed: () => void;
  setOpenedAsNew: (openedAsNew: boolean) => void;
  wasOpenedAsNew: () => boolean;
};

const GalleryCategoryTagDialogContext =
  createContext<GalleryCategoryTagDialogContextValue | null>(null);

export function GalleryCategoryTagDialogProvider({
  children,
  initialOpenedAsNew,
}: {
  children: ReactNode;
  initialOpenedAsNew: boolean;
}) {
  const confirmedRef = useRef(false);
  const openedAsNewRef = useRef(initialOpenedAsNew);

  const value = useMemo<GalleryCategoryTagDialogContextValue>(
    () => ({
      markAddConfirmed: () => {
        confirmedRef.current = true;
      },
      wasAddConfirmed: () => confirmedRef.current,
      resetAddConfirmed: () => {
        confirmedRef.current = false;
      },
      setOpenedAsNew: (openedAsNew) => {
        openedAsNewRef.current = openedAsNew;
      },
      wasOpenedAsNew: () => openedAsNewRef.current,
    }),
    [],
  );

  return (
    <GalleryCategoryTagDialogContext.Provider value={value}>
      {children}
    </GalleryCategoryTagDialogContext.Provider>
  );
}

export function useGalleryCategoryTagDialog() {
  return useContext(GalleryCategoryTagDialogContext);
}
