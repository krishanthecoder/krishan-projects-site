import { useCallback, useEffect, useState } from "react";
import { useClient } from "sanity";

import {
  type TestimonialStructureCounts,
  testimonialStructureCountsQuery,
} from "../../lib/testimonial-structure-counts";
import { sanityApiVersion } from "../env";
import { repairStaleTestimonialDrafts } from "../lib/testimonial-workflow";
import { useTestimonialMutationRefresh } from "./useTestimonialMutationRefresh";

const emptyCounts: TestimonialStructureCounts = {
  pending: 0,
  published: 0,
  discarded: 0,
};

const POLL_INTERVAL_MS = 10_000;

export function useTestimonialStructureCounts() {
  const client = useClient({ apiVersion: sanityApiVersion });
  const [counts, setCounts] = useState<TestimonialStructureCounts>(emptyCounts);
  const [loading, setLoading] = useState(true);

  const loadCounts = useCallback(async () => {
    try {
      await repairStaleTestimonialDrafts(client);
      const next = await client.fetch<TestimonialStructureCounts>(
        testimonialStructureCountsQuery,
      );
      setCounts(next ?? emptyCounts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    void loadCounts();
  }, [loadCounts]);

  useTestimonialMutationRefresh(() => {
    void loadCounts();
  });

  useEffect(() => {
    if (document.visibilityState !== "visible") return undefined;

    const intervalId = window.setInterval(() => {
      void loadCounts();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [loadCounts]);

  return { counts, loading };
}
