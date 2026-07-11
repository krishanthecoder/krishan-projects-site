import { TrashIcon } from "@sanity/icons";
import { useCallback } from "react";
import { useDocumentOperation, type DocumentActionComponent } from "sanity";

import { useNavigateBackFromDocumentPane } from "../hooks/useNavigateBackFromDocumentPane";
import { isDiscardedTestimonial } from "../lib/testimonial-status";

export const PermanentDeleteDiscardedTestimonialAction: DocumentActionComponent = (props) => {
  const { id, type, onComplete } = props;
  const { delete: deleteOp } = useDocumentOperation(id, type);
  const navigateBack = useNavigateBackFromDocumentPane();
  const showDelete = isDiscardedTestimonial(props);

  const handleDelete = useCallback(() => {
    if (deleteOp.disabled) {
      return;
    }

    deleteOp.execute();
    onComplete();
    window.setTimeout(() => navigateBack(), 0);
  }, [deleteOp, navigateBack, onComplete]);

  if (!showDelete) {
    return null;
  }

  return {
    label: "Permanent delete",
    tone: "critical",
    icon: TrashIcon,
    disabled: Boolean(deleteOp.disabled),
    onHandle: handleDelete,
  };
};
