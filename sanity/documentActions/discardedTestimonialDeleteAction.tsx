import { TrashIcon } from "@sanity/icons";
import { useCallback, useState } from "react";
import { useClient, useTranslation, type DocumentActionComponent } from "sanity";
import { ConfirmDeleteDialog, structureLocaleNamespace } from "sanity/structure";

import { sanityApiVersion } from "../env";
import { isDiscardedTestimonial } from "./discardedTestimonialStatus";

export const DiscardedTestimonialDeleteAction: DocumentActionComponent = (props) => {
  const { id, type, draft, onComplete } = props;
  const client = useClient({ apiVersion: sanityApiVersion });
  const { t } = useTranslation(structureLocaleNamespace);
  const [dialogOpen, setDialogOpen] = useState(false);
  const discarded = isDiscardedTestimonial(props);

  const handleCancel = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const handleConfirm = useCallback(() => {
    setDialogOpen(false);
    void client.delete(draft?._id ?? id).then(() => {
      onComplete();
    });
  }, [client, draft?._id, id, onComplete]);

  if (!discarded) {
    return null;
  }

  return {
    label: t("action.delete.label"),
    tone: "critical",
    icon: TrashIcon,
    onHandle: () => setDialogOpen(true),
    dialog: dialogOpen
      ? {
          type: "custom",
          component: (
            <ConfirmDeleteDialog
              action="delete"
              id={draft?._id ?? id}
              type={type}
              onCancel={handleCancel}
              onConfirm={handleConfirm}
            />
          ),
        }
      : undefined,
  };
};
