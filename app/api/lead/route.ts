import { NextResponse } from "next/server";
import { Resend } from "resend";

type LeadRequest = {
  name?: string;
  email?: string;
  phone?: string;
  projectType?: string;
  message?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const resendApiKey = process.env.RESEND_API_KEY;
const leadToEmail = process.env.LEAD_TO_EMAIL;
const leadFromEmail = process.env.LEAD_FROM_EMAIL ?? "onboarding@resend.dev";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(request: Request) {
  const body = (await request.json()) as LeadRequest;

  if (!body.name || !body.email || !body.projectType || !body.message) {
    return NextResponse.json(
      { message: "Name, email, project type, and message are required." },
      { status: 400 },
    );
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

  try {
    await resend.emails.send({
      from: leadFromEmail,
      to: leadToEmail,
      replyTo: body.email,
      subject: `New website lead: ${body.projectType}`,
      text: [
        "A new lead was submitted from your website:",
        "",
        `Name: ${body.name}`,
        `Email: ${body.email}`,
        `Phone: ${body.phone ?? "Not provided"}`,
        `Project Type: ${body.projectType}`,
        "",
        "Message:",
        body.message,
      ].join("\n"),
    });
  } catch (error) {
    console.error("Failed to deliver lead email", error);
    return NextResponse.json({ message: "Failed to deliver your inquiry. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ message: "Lead captured successfully." }, { status: 200 });
}
