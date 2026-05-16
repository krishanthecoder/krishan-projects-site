"use client";

import { useCallback, useEffect, useRef } from "react";
import type { ObjectItemProps } from "sanity";
import { useDialogStack } from "sanity";

import {
  GalleryCategoryTagDialogProvider,
  useGalleryCategoryTagDialog,
} from "../lib/gallery-category-tag-dialog-context";
import { isIncompleteGalleryTag } from "../lib/gallery-tag-utils";
import { GalleryCategoryTagDialogFooter } from "./gallery-category-tag-dialog-footer";

function shouldDiscardTagOnClose(
  value: unknown,
  wasConfirmed: boolean,
  openedAsNew: boolean,
): boolean {
  if (wasConfirmed) return false;
  if (openedAsNew) return true;
  return isIncompleteGalleryTag(value);
}

export function GalleryCategoryTagArrayItem(props: ObjectItemProps) {
  const initialOpenedAsNew = isIncompleteGalleryTag(props.value);

  return (
    <GalleryCategoryTagDialogProvider initialOpenedAsNew={initialOpenedAsNew}>
      <GalleryCategoryTagArrayItemBody {...props} />
    </GalleryCategoryTagDialogProvider>
  );
}

function GalleryCategoryTagArrayItemBody(props: ObjectItemProps) {
  const { renderDefault, onClose, onRemove, open, path, value } = props;
  const dialog = useGalleryCategoryTagDialog();
  const { stack } = useDialogStack({ path });
  const wasInDialogRef = useRef(false);
  const wasOpenRef = useRef(false);

  const finishClose = useCallback(() => {
    const wasConfirmed = dialog?.wasAddConfirmed() ?? false;
    const openedAsNew = dialog?.wasOpenedAsNew() ?? false;

    if (shouldDiscardTagOnClose(value, wasConfirmed, openedAsNew)) {
      onRemove();
    } else {
      onClose();
    }
    dialog?.resetAddConfirmed();
  }, [dialog, onClose, onRemove, value]);

  useEffect(() => {
    const inDialog = stack.length > 0;
    if (wasInDialogRef.current && !inDialog) {
      finishClose();
    }
    wasInDialogRef.current = inDialog;
  }, [finishClose, stack.length]);

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      dialog?.setOpenedAsNew(isIncompleteGalleryTag(value));
      dialog?.resetAddConfirmed();
    }
    wasOpenRef.current = Boolean(open);
  }, [dialog, open, value]);

  const handleClose = useCallback(() => {
    finishClose();
  }, [finishClose]);

  return (
    <>
      {renderDefault({
        ...props,
        onClose: handleClose,
        open,
      })}
      <GalleryCategoryTagDialogFooter open={Boolean(open)} path={path} value={value} />
    </>
  );
}
