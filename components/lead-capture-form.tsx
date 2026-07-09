"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  AtSign,
  CheckCircle2,
  ListChecks,
  MapPin,
  MessageSquareText,
  Smartphone,
  UserRound,
} from "lucide-react";

import { BrandedSelect } from "@/components/ui/branded-select";
import { FormIconField } from "@/components/ui/form-icon-field";
import { leadProjectTypeOptions } from "@/lib/lead-form-project-types";

type LeadFormValues = {
  name: string;
  email: string;
  phone: string;
  postcode: string;
  projectType: string;
  message: string;
};

const iconInputClass = "kp-lead-icon-field__input";

export function LeadCaptureForm() {
  const successRef = useRef<HTMLDivElement>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    defaultValues: { projectType: "" },
  });

  useEffect(() => {
    if (!isSuccess || !successRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    successRef.current.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "center",
    });
  }, [isSuccess]);

  const handleSendAnother = () => {
    setIsSuccess(false);
    setStatusMessage(null);
    reset({ projectType: "" });
  };

  const onSubmit = async (values: LeadFormValues) => {
    setStatusMessage(null);
    setIsSuccess(false);

    const response = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const payload = (await response.json()) as {
      message?: string;
      confirmationEmailSent?: boolean;
    };

    if (!response.ok) {
      setStatusMessage(payload.message ?? "Unable to submit your request.");
      setIsSuccess(false);
      return;
    }

    setStatusMessage(
      payload.confirmationEmailSent
        ? "We've also sent a confirmation to your email address."
        : "We'll be in touch as soon as possible — usually within a few hours on weekdays.",
    );
    setIsSuccess(true);
    reset({ projectType: "" });
  };

  return (
    <section
      className="rounded-3xl border border-graphite/8 bg-parchment p-8 shadow-sm sm:p-12"
      aria-labelledby="lead-form-heading"
    >
      {isSuccess && statusMessage ? (
        <div
          ref={successRef}
          className="mx-auto max-w-lg text-center"
          role="status"
          aria-live="polite"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage/15">
            <CheckCircle2 className="h-9 w-9 text-sage" aria-hidden />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-graphite sm:text-4xl">
            Message sent
          </h2>
          <p className="mt-4 text-base leading-relaxed text-graphite/90">
            Thanks — we&apos;ve got your message.
          </p>
          <p className="mt-2 text-base leading-relaxed text-graphite/80">{statusMessage}</p>
          <button
            type="button"
            onClick={handleSendAnother}
            className="mt-8 inline-flex items-center justify-center rounded-xl border border-graphite/15 bg-stone-white px-6 py-3 text-sm font-semibold text-graphite shadow-sm transition hover:border-graphite/25 hover:bg-stone-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-parchment"
          >
            Send another message
          </button>
        </div>
      ) : (
        <>
          <div className="mb-10 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Free, no-pressure quotes
            </p>
            <h2
              id="lead-form-heading"
              className="text-3xl font-bold tracking-tight text-graphite sm:text-4xl"
            >
              Message us about your project
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-graphite/85 sm:text-base">
              Drop us a message and we&apos;ll get back to you today — a friendly chat about what
              you&apos;re planning, a free site visit, and a clear written quote. No commitment, no
              hard sell.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5 sm:grid-cols-2">
            <FormIconField icon={UserRound} error={errors.name?.message}>
              <input
                {...register("name", { required: "Name is required." })}
                className={iconInputClass}
                placeholder="Full name *"
                aria-label="Full name"
                autoComplete="name"
              />
            </FormIconField>

            <FormIconField icon={AtSign} error={errors.email?.message}>
              <input
                {...register("email", {
                  required: "Email is required.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address.",
                  },
                })}
                className={iconInputClass}
                placeholder="Email address *"
                aria-label="Email address"
                type="email"
                autoComplete="email"
              />
            </FormIconField>

            <FormIconField icon={Smartphone} error={errors.phone?.message}>
              <input
                {...register("phone", {
                  required: "Phone number is required.",
                  minLength: {
                    value: 10,
                    message: "Enter a valid UK phone number.",
                  },
                })}
                className={iconInputClass}
                placeholder="Phone *"
                aria-label="Phone"
                type="tel"
                autoComplete="tel"
              />
            </FormIconField>

            <FormIconField icon={MapPin} error={errors.postcode?.message}>
              <input
                {...register("postcode", {
                  required: "Postcode is required.",
                  minLength: {
                    value: 5,
                    message: "Enter a valid UK postcode.",
                  },
                })}
                className={iconInputClass}
                placeholder="Postcode *"
                aria-label="Postcode"
                autoComplete="postal-code"
              />
            </FormIconField>

            <FormIconField icon={ListChecks} error={errors.projectType?.message}>
              <Controller
                name="projectType"
                control={control}
                rules={{ required: "Select a project type." }}
                render={({ field }) => (
                  <BrandedSelect
                    id="lead-project-type"
                    embedded
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    options={leadProjectTypeOptions}
                    placeholder="Project type *"
                    aria-label="Project type"
                    aria-invalid={errors.projectType ? true : undefined}
                  />
                )}
              />
            </FormIconField>

            <FormIconField
              icon={MessageSquareText}
              multiline
              error={errors.message?.message}
              className="sm:col-span-2"
            >
              <textarea
                {...register("message", {
                  required: "Please share project details.",
                  minLength: {
                    value: 10,
                    message: "Please enter at least 10 characters.",
                  },
                })}
                className={`${iconInputClass} kp-lead-icon-field__input--textarea`}
                placeholder="Briefly describe your project *"
                aria-label="Briefly describe your project"
              />
            </FormIconField>

            {statusMessage && !isSuccess ? (
              <div
                role="alert"
                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 sm:col-span-2"
              >
                {statusMessage}
              </div>
            ) : null}

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-xl bg-graphite px-7 py-3 text-sm font-semibold text-stone-white shadow-sm transition hover:bg-graphite/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-parchment disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Sending..." : "Send us a message"}
              </button>
            </div>
          </form>
        </>
      )}
    </section>
  );
}
