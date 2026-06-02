import { NextResponse } from "next/server";
import { Resend } from "resend";

import { formatUkPhoneDisplay } from "@/lib/format-phone";

type LeadRequest = {
  name?: string;
  email?: string;
  phone?: string;
  postcode?: string;
  projectType?: string;
  message?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const resendApiKey = process.env.RESEND_API_KEY;
const leadToEmail = process.env.LEAD_TO_EMAIL;
const leadFromEmail = process.env.LEAD_FROM_EMAIL ?? "onboarding@resend.dev";
const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME ?? "Krishan Projects";
const businessPhone = process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

function leadFromAddress(): string {
  return `${businessName} <${leadFromEmail}>`;
}

function formatProjectType(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildLeadNotificationText(body: LeadRequest): string {
  return [
    "A new lead was submitted from your website:",
    "",
    `Name: ${body.name}`,
    `Email: ${body.email}`,
    `Phone: ${body.phone}`,
    `Postcode: ${body.postcode}`,
    `Project Type: ${formatProjectType(body.projectType ?? "")}`,
    "",
    "Message:",
    body.message,
  ].join("\n");
}

function buildAutoReplyText(name: string, projectType: string): string {
  const firstName = name.trim().split(/\s+/)[0] || name;
  const phoneLine = businessPhone
    ? `If you'd rather talk, call us on ${formatUkPhoneDisplay(businessPhone)}.`
    : "If you'd rather talk, reply to this email and we'll call you back.";

  return [
    `Hi ${firstName},`,
    "",
    `Thank you for contacting ${businessName}. We've received your enquiry about ${formatProjectType(projectType)}.`,
    "",
    "We'll review your message and get back to you as soon as possible — usually within a few hours on weekdays.",
    "",
    phoneLine,
    "",
    "Best regards,",
    businessName,
    "",
    "---",
    "Please do not reply to this address with sensitive information. Your original message has been passed to our team.",
  ].join("\n");
}

export async function POST(request: Request) {
  const body = (await request.json()) as LeadRequest;

  if (!body.name || !body.email || !body.phone || !body.postcode || !body.projectType || !body.message) {
    return NextResponse.json(
      { message: "Name, email, phone, postcode, project type, and message are required." },
      { status: 400 },
    );
  }

  if (body.postcode.trim().length < 5) {
    return NextResponse.json({ message: "Please enter a valid UK postcode." }, { status: 400 });
  }

  const phoneDigits = body.phone.replace(/\D/g, "");
  if (phoneDigits.length < 10) {
    return NextResponse.json({ message: "Please enter a valid phone number." }, { status: 400 });
  }

  if (!emailPattern.test(body.email)) {
    return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
  }

  if (!resend || !leadToEmail) {
    return NextResponse.json(
      {
        message:
          "Lead delivery is not configured. Add RESEND_API_KEY and LEAD_TO_EMAIL environment variables.",
      },
      { status: 500 },
    );
  }

  const { error: leadError } = await resend.emails.send({
    from: leadFromAddress(),
    to: leadToEmail,
    replyTo: body.email,
    subject: `New Lead from Krishan Projects Website: ${body.projectType}`,
    text: buildLeadNotificationText(body),
  });

  if (leadError) {
    console.error("Failed to deliver lead email", leadError);
    return NextResponse.json({ message: "Failed to deliver your inquiry. Please try again." }, { status: 502 });
  }

  let confirmationEmailSent = false;

  const { error: autoReplyError } = await resend.emails.send({
    from: leadFromAddress(),
    to: body.email,
    replyTo: leadToEmail,
    subject: `We've received your message — ${businessName}`,
    text: buildAutoReplyText(body.name, body.projectType),
  });

  if (autoReplyError) {
    console.error("Lead received but auto-reply failed", autoReplyError);
  } else {
    confirmationEmailSent = true;
  }

  return NextResponse.json({
    message: "Lead captured successfully.",
    confirmationEmailSent,
  });
}
