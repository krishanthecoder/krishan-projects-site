import { TrashIcon } from "@sanity/icons";
import { useToast } from "@sanity/ui";
import { useCallback, useState } from "react";
import { useClient, type DocumentActionComponent } from "sanity";
import { usePaneRouter } from "sanity/structure";

import { sanityApiVersion } from "../env";
import { commitTestimonialWorkflow } from "../lib/testimonial-workflow";
import { isPublishedTestimonial } from "../lib/testimonial-status";

export const DiscardPublishedTestimonialAction: DocumentActionComponent = (props) => {
  const { id } = props;
  const client = useClient({ apiVersion: sanityApiVersion });
  const { closeCurrent } = usePaneRouter();
  const toast = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const showDiscard = isPublishedTestimonial(props);

  const handleCancel = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const handleConfirm = useCallback(() => {
    setDialogOpen(false);
    void commitTestimonialWorkflow(client, id, { status: "discarded" })
      .then(() => {
        toast.push({
          status: "success",
          title: "Review discarded",
          description: "It has been removed from the website and moved to Discarded.",
        });
        closeCurrent();
      })
      .catch((error: unknown) => {
        console.error(error);
        toast.push({
          status: "error",
          title: "Discard failed",
          description: "Please try again.",
        });
      });
  }, [client, closeCurrent, id, toast]);

  if (!showDiscard) {
    return null;
  }

  return {
    label: "Discard",
    tone: "critical",
    icon: TrashIcon,
    onHandle: () => setDialogOpen(true),
    dialog: dialogOpen
      ? {
          type: "confirm",
          tone: "critical",
          message: "Remove this review from the website? It will move to Discarded.",
          confirmButtonText: "Discard review",
          onConfirm: handleConfirm,
          onCancel: handleCancel,
        }
      : undefined,
  };
};
