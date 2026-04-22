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

export function LeadCaptureForm() {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>();

  const onSubmit = async (values: LeadFormValues) => {
    setStatusMessage(null);

    const response = await fetch("/api/lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const payload = (await response.json()) as { message?: string };

    if (!response.ok) {
      setStatusMessage(payload.message ?? "Unable to submit your request.");
      return;
    }

    setStatusMessage("Thanks! Our team will contact you shortly.");
    reset();
  };

  return (
    <section className="space-y-4 rounded-2xl border border-dark-slate/10 bg-off-white p-6 sm:p-8">
      <h2 className="text-2xl font-semibold text-dark-slate sm:text-3xl">Lead Capture</h2>
      <p className="text-sm text-steel-gray sm:text-base">
        Tell us about your project and we will schedule a consultation.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm font-medium text-dark-slate">
          Name
          <input
            {...register("name", { required: "Name is required." })}
            className="w-full rounded-md border border-dark-slate/20 bg-white px-3 py-2 text-sm outline-none ring-industrial-orange focus:ring-2"
            placeholder="John Smith"
          />
          {errors.name ? <p className="text-xs text-industrial-orange">{errors.name.message}</p> : null}
        </label>

        <label className="space-y-1 text-sm font-medium text-dark-slate">
          Email
          <input
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address.",
              },
            })}
            className="w-full rounded-md border border-dark-slate/20 bg-white px-3 py-2 text-sm outline-none ring-industrial-orange focus:ring-2"
            placeholder="you@example.com"
            type="email"
          />
          {errors.email ? <p className="text-xs text-industrial-orange">{errors.email.message}</p> : null}
        </label>

        <label className="space-y-1 text-sm font-medium text-dark-slate">
          Phone
          <input
            {...register("phone")}
            className="w-full rounded-md border border-dark-slate/20 bg-white px-3 py-2 text-sm outline-none ring-industrial-orange focus:ring-2"
            placeholder="+1 555 010 0200"
            type="tel"
          />
        </label>

        <label className="space-y-1 text-sm font-medium text-dark-slate">
          Project Type
          <select
            {...register("projectType", { required: "Select a project type." })}
            className="w-full rounded-md border border-dark-slate/20 bg-white px-3 py-2 text-sm outline-none ring-industrial-orange focus:ring-2"
          >
            <option value="">Select an option</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
            <option value="renovation">Renovation</option>
          </select>
          {errors.projectType ? (
            <p className="text-xs text-industrial-orange">{errors.projectType.message}</p>
          ) : null}
        </label>

        <label className="space-y-1 text-sm font-medium text-dark-slate sm:col-span-2">
          Message
          <textarea
            {...register("message", {
              required: "Please share project details.",
              minLength: {
                value: 10,
                message: "Please enter at least 10 characters.",
              },
            })}
            className="h-28 w-full rounded-md border border-dark-slate/20 bg-white px-3 py-2 text-sm outline-none ring-industrial-orange focus:ring-2"
            placeholder="Tell us about your site, timeline, and requirements."
          />
          {errors.message ? (
            <p className="text-xs text-industrial-orange">{errors.message.message}</p>
          ) : null}
        </label>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-md bg-industrial-orange px-5 py-3 text-sm font-semibold text-off-white transition hover:bg-industrial-orange/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Sending..." : "Submit Inquiry"}
          </button>
          {statusMessage ? (
            <p className="mt-3 text-sm text-steel-gray" role="status" aria-live="polite">
              {statusMessage}
            </p>
          ) : null}
        </div>
      </form>
    </section>
  );
}
