import { NextResponse } from "next/server";
import { Resend } from "resend";

import { getEmailBusinessName } from "@/lib/emails/brand";
import {
  buildAutoReplyHtml,
  buildAutoReplySubject,
  buildAutoReplyText,
  buildLeadNotificationHtml,
  buildLeadNotificationText,
  formatProjectType,
} from "@/lib/emails/lead-emails";

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
const businessName = getEmailBusinessName();

const resend = resendApiKey ? new Resend(resendApiKey) : null;

function leadFromAddress(): string {
  return `${businessName} <${leadFromEmail}>`;
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

  const leadPayload = {
    name: body.name,
    email: body.email,
    phone: body.phone,
    postcode: body.postcode,
    projectType: body.projectType,
    message: body.message,
  };

  const { error: leadError } = await resend.emails.send({
    from: leadFromAddress(),
    to: leadToEmail,
    replyTo: body.email,
    subject: `New Lead from Krishan Projects Website: ${formatProjectType(body.projectType)}`,
    text: buildLeadNotificationText(leadPayload),
    html: buildLeadNotificationHtml(leadPayload),
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
    subject: buildAutoReplySubject(body.projectType),
    text: buildAutoReplyText(body.name, body.projectType),
    html: buildAutoReplyHtml(body.name, body.projectType),
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
