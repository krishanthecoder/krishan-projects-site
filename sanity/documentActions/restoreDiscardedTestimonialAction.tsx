import { UndoIcon } from "@sanity/icons";
import { useToast } from "@sanity/ui";
import { useCallback } from "react";
import { useClient, type DocumentActionComponent } from "sanity";

import { sanityApiVersion } from "../env";
import { useNavigateBackFromDocumentPane } from "../hooks/useNavigateBackFromDocumentPane";
import { commitTestimonialWorkflow } from "../lib/testimonial-workflow";
import { isDiscardedTestimonial } from "../lib/testimonial-status";

export const RestoreDiscardedTestimonialAction: DocumentActionComponent = (props) => {
  const { id } = props;
  const client = useClient({ apiVersion: sanityApiVersion });
  const toast = useToast();
  const navigateBack = useNavigateBackFromDocumentPane();
  const showRestore = isDiscardedTestimonial(props);

  const handleRestore = useCallback(() => {
    void commitTestimonialWorkflow(client, id, { status: "published" })
      .then(() => {
        toast.push({
          status: "success",
          title: "Review restored",
          description: "This review is live on the website again under Published on site.",
        });
        window.setTimeout(() => navigateBack(), 0);
      })
      .catch((error: unknown) => {
        console.error(error);
        toast.push({
          status: "error",
          title: "Restore failed",
          description: "Please try again.",
        });
      });
  }, [client, id, navigateBack, toast]);

  if (!showRestore) {
    return null;
  }

  return {
    label: "Restore to site",
    tone: "primary",
    icon: UndoIcon,
    onHandle: handleRestore,
  };
};
