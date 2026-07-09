import { NextResponse } from "next/server";
import { Resend } from "resend";

import {
  buildReviewNotificationHtml,
  buildReviewNotificationText,
} from "@/lib/emails/review-notification-email";
import { getEmailBusinessName } from "@/lib/emails/brand";
import { getSanityWriteClient } from "@/lib/sanity.server";

type TestimonialRequest = {
  clientName?: string;
  jobTitle?: string;
  rating?: number;
  content?: string;
  company?: string;
};

const resendApiKey = process.env.RESEND_API_KEY;
const notifyToEmail = process.env.LEAD_TO_EMAIL;
const notifyFromEmail = process.env.LEAD_FROM_EMAIL ?? "onboarding@resend.dev";
const businessName = getEmailBusinessName();

const resend = resendApiKey ? new Resend(resendApiKey) : null;

function notifyFromAddress(): string {
  return `${businessName} <${notifyFromEmail}>`;
}

function normalizeRating(value: unknown): number | null {
  const rating = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(rating)) return null;
  const rounded = Math.round(rating);
  if (rounded < 1 || rounded > 5) return null;
  return rounded;
}

export async function POST(request: Request) {
  const body = (await request.json()) as TestimonialRequest;

  if (body.company?.trim()) {
    return NextResponse.json({ message: "Thanks — your review was received." });
  }

  const clientName = body.clientName?.trim() ?? "";
  const jobTitle = body.jobTitle?.trim() ?? "";
  const content = body.content?.trim() ?? "";
  const rating = normalizeRating(body.rating);

  if (!clientName) {
    return NextResponse.json({ message: "Please enter your name." }, { status: 400 });
  }

  if (jobTitle.length < 5) {
    return NextResponse.json(
      { message: "Please describe the job (at least 5 characters)." },
      { status: 400 },
    );
  }

  if (!rating) {
    return NextResponse.json({ message: "Please select a star rating." }, { status: 400 });
  }

  if (content.length < 10) {
    return NextResponse.json(
      { message: "Please write a little more about your experience (at least 10 characters)." },
      { status: 400 },
    );
  }

  const client = getSanityWriteClient();
  if (!client) {
    return NextResponse.json(
      {
        message:
          "Review submissions are not configured yet. Please contact us directly.",
      },
      { status: 500 },
    );
  }

  try {
    const doc = await client.create({
      _type: "testimonial",
      status: "pending",
      source: "customer-form",
      clientName,
      jobTitle,
      rating,
      content,
    });

    if (resend && notifyToEmail) {
      const { error: notifyError } = await resend.emails.send({
        from: notifyFromAddress(),
        to: notifyToEmail,
        subject: `New review submission — ${businessName}`,
        text: buildReviewNotificationText({
          clientName,
          jobTitle,
          rating,
          content,
          documentId: doc._id,
        }),
        html: buildReviewNotificationHtml({
          clientName,
          jobTitle,
          rating,
          content,
          documentId: doc._id,
        }),
      });

      if (notifyError) {
        console.error("Review saved but notification email failed", notifyError);
      }
    } else {
      console.warn(
        "Review saved without email notification — set RESEND_API_KEY and LEAD_TO_EMAIL.",
      );
    }

    return NextResponse.json({
      message: "Our team will check it before it appears on the website.",
      id: doc._id,
    });
  } catch (error) {
    console.error("Failed to create testimonial submission", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again in a moment." },
      { status: 502 },
    );
  }
}
