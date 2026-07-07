"use client";

import { Briefcase, MessageSquareText, UserRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { TestimonialStarPicker } from "@/components/testimonial-star-picker";
import { FormIconField } from "@/components/ui/form-icon-field";

type TestimonialFormValues = {
  clientName: string;
  jobTitle: string;
  content: string;
  company: string;
};

const iconInputClass = "kp-lead-icon-field__input";

export function TestimonialSubmissionForm() {
  const [rating, setRating] = useState(0);
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialFormValues>({
    defaultValues: { company: "" },
  });

  const onSubmit = async (values: TestimonialFormValues) => {
    setStatusMessage(null);
    setIsSuccess(false);

    if (rating < 1) {
      setRatingError("Please select a star rating.");
      return;
    }

    setRatingError(null);

    const response = await fetch("/api/testimonial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName: values.clientName,
        jobTitle: values.jobTitle,
        content: values.content,
        rating,
        company: values.company,
      }),
    });

    const payload = (await response.json()) as { message?: string };

    if (!response.ok) {
      setStatusMessage(payload.message ?? "Unable to submit your review.");
      setIsSuccess(false);
      return;
    }

    setStatusMessage(
      payload.message ??
        "Thank you — we've received your review and will check it before it goes live.",
    );
    setIsSuccess(true);
    reset();
    setRating(0);
  };

  return (
    <section
      className="rounded-3xl border border-graphite/8 bg-parchment p-8 shadow-sm sm:p-12"
      aria-labelledby="testimonial-form-heading"
    >
      <div className="mb-10 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          Share your experience
        </p>
        <h2
          id="testimonial-form-heading"
          className="text-3xl font-bold tracking-tight text-graphite sm:text-4xl"
        >
          Leave us a review
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-graphite/85 sm:text-base">
          If we&apos;ve worked on your home, we&apos;d really appreciate hearing how it went.
          Reviews are checked by our team before they appear on the website.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5">
        <FormIconField icon={UserRound} error={errors.clientName?.message}>
          <input
            {...register("clientName", { required: "Name is required." })}
            className={iconInputClass}
            placeholder="Your name *"
            aria-label="Your name"
            autoComplete="name"
          />
        </FormIconField>

        <FormIconField icon={Briefcase} error={errors.jobTitle?.message}>
          <input
            {...register("jobTitle", {
              required: "Please describe the job.",
              minLength: {
                value: 5,
                message: "Please add a bit more detail (at least 5 characters).",
              },
            })}
            className={iconInputClass}
            placeholder="Job description (e.g. Kitchen renovation in Grays) *"
            aria-label="Job description"
          />
        </FormIconField>

        <TestimonialStarPicker
          value={rating}
          onChange={(value) => {
            setRating(value);
            setRatingError(null);
          }}
          disabled={isSubmitting}
          error={ratingError ?? undefined}
        />

        <FormIconField icon={MessageSquareText} error={errors.content?.message}>
          <textarea
            {...register("content", {
              required: "Please write your review.",
              minLength: {
                value: 10,
                message: "Please write a little more (at least 10 characters).",
              },
            })}
            className={`${iconInputClass} min-h-32 resize-y`}
            placeholder="Your review — what went well, how was the team, would you recommend us? *"
            aria-label="Your review"
            rows={5}
          />
        </FormIconField>

        <input
          {...register("company")}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-full bg-gold px-8 py-3 text-sm font-semibold text-stone-white shadow-sm transition hover:bg-gold/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Sending…" : "Submit review"}
          </button>
          <p className="text-xs text-warm-mist">
            We moderate submissions before publishing.
          </p>
        </div>

        {statusMessage ? (
          <p
            role="status"
            className={`text-sm font-medium ${
              isSuccess ? "text-emerald-700" : "text-red-600"
            }`}
          >
            {statusMessage}
          </p>
        ) : null}
      </form>
    </section>
  );
}
