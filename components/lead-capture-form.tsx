"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  AtSign,
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
        ? "Thanks — we've got your message and sent a confirmation to your email. We'll be in touch as soon as possible."
        : "Thanks — we've got your message. We'll be in touch as soon as possible.",
    );
    setIsSuccess(true);
    reset();
  };

  return (
    <section className="rounded-3xl border border-graphite/8 bg-parchment p-8 shadow-sm sm:p-12" aria-labelledby="lead-form-heading">
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
          Drop us a message and we&apos;ll get back to you today — a friendly chat about what you&apos;re planning, a free site visit, and a clear written quote. No commitment, no hard sell.
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

        <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-xl bg-graphite px-7 py-3 text-sm font-semibold text-stone-white shadow-sm transition hover:bg-graphite/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-parchment disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : "Send us a message"}
          </button>

          {statusMessage ? (
            <p
              className={`text-sm ${isSuccess ? "text-sage" : "text-rose-600"}`}
              role="status"
              aria-live="polite"
            >
              {statusMessage}
            </p>
          ) : null}
        </div>
      </form>
    </section>
  );
}
