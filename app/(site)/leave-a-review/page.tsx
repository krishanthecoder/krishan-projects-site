import type { Metadata } from "next";

import { LeaveReviewHero } from "@/components/leave-review/leave-review-hero";
import { TestimonialSubmissionForm } from "@/components/testimonial-submission-form";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME ?? "Krishan Projects";

export const metadata: Metadata = {
  title: `Leave a review | ${businessName}`,
  description: `Share your experience with ${businessName}. Customer reviews are moderated before appearing on the website.`,
};

export default function LeaveAReviewPage() {
  return (
    <main id="main-content" className="min-h-screen bg-stone-white">
      <LeaveReviewHero />

      <ScrollReveal className="mx-auto max-w-6xl px-6 pb-20 pt-12 sm:px-10 sm:pb-24 sm:pt-14">
        <TestimonialSubmissionForm />
      </ScrollReveal>
    </main>
  );
}
