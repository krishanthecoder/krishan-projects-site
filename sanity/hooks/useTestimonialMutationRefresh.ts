import { useEffect, useRef } from "react";
import { useClient } from "sanity";

import { sanityApiVersion } from "../env";
import { TESTIMONIAL_WORKFLOW_CHANGED_EVENT } from "../lib/testimonial-workflow";

const testimonialListenFilter = `*[_type == "testimonial"]`;

/** Refetch when testimonials change, including API submissions from /leave-a-review. */
export function useTestimonialMutationRefresh(onRefresh: () => void) {
  const client = useClient({ apiVersion: sanityApiVersion });
  const onRefreshRef = useRef(onRefresh);

  onRefreshRef.current = onRefresh;

  useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout> | undefined;

    const scheduleRefresh = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        onRefreshRef.current();
      }, 150);
    };

    const subscription = client
      .listen(
        testimonialListenFilter,
        {},
        { includeResult: false, visibility: "query" },
      )
      .subscribe(scheduleRefresh);

    const onWorkflowChanged = () => {
      scheduleRefresh();
    };

    window.addEventListener(TESTIMONIAL_WORKFLOW_CHANGED_EVENT, onWorkflowChanged);

    return () => {
      clearTimeout(debounceTimer);
      subscription.unsubscribe();
      window.removeEventListener(TESTIMONIAL_WORKFLOW_CHANGED_EVENT, onWorkflowChanged);
    };
  }, [client]);

  useEffect(() => {
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") {
        onRefreshRef.current();
      }
    };

    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, []);
}
