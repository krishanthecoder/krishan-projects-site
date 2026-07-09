import { formatUkPhoneDisplay } from "@/lib/format-phone";
import {
  emailBrand,
  getEmailBusinessName,
  getEmailWebsiteUrl,
} from "@/lib/emails/brand";
import {
  emailCtaButton,
  emailDetailRow,
  emailMessageBlock,
  escapeHtml,
  wrapBrandedEmail,
} from "@/lib/emails/layout";

export type LeadEmailPayload = {
  name: string;
  email: string;
  phone: string;
  postcode: string;
  projectType: string;
  message: string;
};

export function formatProjectType(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function buildLeadNotificationText(body: LeadEmailPayload): string {
  return [
    "A new lead was submitted from your website:",
    "",
    `Name: ${body.name}`,
    `Email: ${body.email}`,
    `Phone: ${body.phone}`,
    `Postcode: ${body.postcode}`,
    `Project Type: ${formatProjectType(body.projectType)}`,
    "",
    "Message:",
    body.message,
  ].join("\n");
}

export function buildLeadNotificationHtml(body: LeadEmailPayload): string {
  const rows = [
    emailDetailRow("Name", body.name),
    emailDetailRow("Email", body.email),
    emailDetailRow("Phone", body.phone),
    emailDetailRow("Postcode", body.postcode),
    emailDetailRow("Project type", formatProjectType(body.projectType)),
  ].join("");

  const bodyHtml = `<p style="margin:0 0 18px;font-size:16px;line-height:1.65;color:${emailBrand.graphite};">
    A new enquiry was submitted on your website.
  </p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    ${rows}
  </table>
  ${emailMessageBlock("Message", body.message)}`;

  return wrapBrandedEmail({
    eyebrow: "New lead",
    title: formatProjectType(body.projectType),
    bodyHtml,
    header: "dark",
  });
}

export function buildAutoReplyText(name: string, projectType: string): string {
  const businessName = getEmailBusinessName();
  const businessPhone = process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "";
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

export function buildAutoReplyHtml(name: string, projectType: string): string {
  const businessName = getEmailBusinessName();
  const businessPhone = process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? "";
  const websiteUrl = escapeHtml(getEmailWebsiteUrl());
  const firstName = escapeHtml(name.trim().split(/\s+/)[0] || name);
  const formattedProject = escapeHtml(formatProjectType(projectType));

  const phoneHtml = businessPhone
    ? `If you'd rather talk, call us on <a href="tel:${escapeHtml(businessPhone.replace(/\s/g, ""))}" style="color:${emailBrand.gold};font-weight:600;text-decoration:none;">${escapeHtml(formatUkPhoneDisplay(businessPhone))}</a>.`
    : "If you'd rather talk, reply to this email and we'll call you back.";

  const bodyHtml = `<p style="margin:0 0 16px;font-size:16px;line-height:1.65;">Hi ${firstName},</p>
  <p style="margin:0 0 16px;font-size:16px;line-height:1.65;">
    Thank you for contacting <strong>${escapeHtml(businessName)}</strong>. We've received your enquiry about <strong>${formattedProject}</strong>.
  </p>
  <p style="margin:0 0 16px;font-size:16px;line-height:1.65;">
    We'll review your message and get back to you as soon as possible — usually within a few hours on weekdays.
  </p>
  <p style="margin:0 0 16px;font-size:16px;line-height:1.65;">${phoneHtml}</p>
  <p style="margin:0;font-size:16px;line-height:1.65;">
    Best regards,<br />
    <strong>${escapeHtml(businessName)}</strong>
  </p>
  <p style="margin:20px 0 0;font-size:16px;line-height:1.65;">
    ${emailCtaButton("Visit our website", websiteUrl)}
  </p>`;

  return wrapBrandedEmail({
    eyebrow: "Enquiry received",
    title: "We've got your message",
    bodyHtml,
    header: "light",
    showFooterLink: false,
    footerNote:
      "Please do not reply to this address with sensitive information. Your original message has been passed to our team.",
  });
}
