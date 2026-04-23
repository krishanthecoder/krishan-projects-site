"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

type LeadFormValues = {
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  message: string;
};

const inputBase =
  "w-full rounded-xl border border-graphite/15 bg-stone-white px-4 py-2.5 text-sm text-graphite placeholder:text-warm-mist/60 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/25";

const labelBase = "flex flex-col gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-graphite/70";

export function LeadCaptureForm() {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>();

  const onSubmit = async (values: LeadFormValues) => {
    setStatusMessage(null);
    setIsSuccess(false);

    const response = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const payload = (await response.json()) as { message?: string };

    if (!response.ok) {
      setStatusMessage(payload.message ?? "Unable to submit your request.");
      setIsSuccess(false);
      return;
    }

    setStatusMessage("Thanks. We've got your message and will come back to you today.");
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
        <p className="max-w-md text-sm leading-relaxed text-warm-mist sm:text-base">
          Drop us a message and we&apos;ll get back to you today — a friendly chat about what you&apos;re planning, a free site visit, and a clear written quote. No commitment, no hard sell.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5 sm:grid-cols-2">
        <label className={labelBase}>
          Full Name
          <input
            {...register("name", { required: "Name is required." })}
            className={inputBase}
            placeholder="Jane Smith"
            autoComplete="name"
          />
          {errors.name ? (
            <p className="text-xs font-normal normal-case tracking-normal text-rose-600" role="alert">
              {errors.name.message}
            </p>
          ) : null}
        </label>

        <label className={labelBase}>
          Email Address
          <input
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address.",
              },
            })}
            className={inputBase}
            placeholder="you@example.com"
            type="email"
            autoComplete="email"
          />
          {errors.email ? (
            <p className="text-xs font-normal normal-case tracking-normal text-rose-600" role="alert">
              {errors.email.message}
            </p>
          ) : null}
        </label>

        <label className={labelBase}>
          Phone <span className="font-normal normal-case tracking-normal text-warm-mist/60">(optional)</span>
          <input
            {...register("phone")}
            className={inputBase}
            placeholder="+44 7700 000 000"
            type="tel"
            autoComplete="tel"
          />
        </label>

        <label className={labelBase}>
          Project Type
          <select
            {...register("projectType", { required: "Select a project type." })}
            className={inputBase}
          >
            <option value="">Select an option</option>
            <option value="kitchen-fitting">Kitchen fitting</option>
            <option value="home-renovation">Home renovation</option>
            <option value="extension">Extension</option>
            <option value="bathroom-renovation">Bathroom renovation</option>
            <option value="general-building-works">General building works</option>
          </select>
          {errors.projectType ? (
            <p className="text-xs font-normal normal-case tracking-normal text-rose-600" role="alert">
              {errors.projectType.message}
            </p>
          ) : null}
        </label>

        <label className={`${labelBase} sm:col-span-2`}>
          Message
          <textarea
            {...register("message", {
              required: "Please share project details.",
              minLength: {
                value: 10,
                message: "Please enter at least 10 characters.",
              },
            })}
            className={`${inputBase} h-32 resize-none`}
            placeholder="Tell us about the property, the work you need, and when you would like to start."
          />
          {errors.message ? (
            <p className="text-xs font-normal normal-case tracking-normal text-rose-600" role="alert">
              {errors.message.message}
            </p>
          ) : null}
        </label>

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
