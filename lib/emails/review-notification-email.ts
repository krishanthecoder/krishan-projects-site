import { emailBrand, getEmailWebsiteUrl } from "@/lib/emails/brand";
import {
  emailCtaButton,
  emailDetailRow,
  emailMessageBlock,
  escapeHtml,
  wrapBrandedEmail,
} from "@/lib/emails/layout";

export type ReviewNotificationPayload = {
  clientName: string;
  jobTitle: string;
  rating: number;
  content: string;
  documentId: string;
};

export function buildReviewNotificationText({
  clientName,
  jobTitle,
  rating,
  content,
  documentId,
}: ReviewNotificationPayload): string {
  const studioUrl = `${getEmailWebsiteUrl()}/studio`;

  return [
    "A new customer review was submitted on your website.",
    "",
    `Name: ${clientName}`,
    `Job: ${jobTitle}`,
    `Rating: ${rating}/5`,
    "",
    "Review:",
    content,
    "",
    `Sanity document: ${documentId}`,
    `Review in Studio: ${studioUrl}`,
    "",
    "Status: pending — publish or discard from Studio → Review submissions.",
  ].join("\n");
}

export function buildReviewNotificationHtml({
  clientName,
  jobTitle,
  rating,
  content,
  documentId,
}: ReviewNotificationPayload): string {
  const studioUrl = escapeHtml(`${getEmailWebsiteUrl()}/studio`);
  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);

  const rows = [
    emailDetailRow("Name", clientName),
    emailDetailRow("Job", jobTitle),
    emailDetailRow("Rating", `${rating}/5`),
  ].join("");

  const bodyHtml = `<p style="margin:0 0 18px;font-size:16px;line-height:1.65;color:${emailBrand.graphite};">
    A new customer review was submitted on your website.
  </p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    ${rows}
  </table>
  <p style="margin:16px 0 0;font-size:18px;line-height:1;letter-spacing:0.08em;color:${emailBrand.gold};">${stars}</p>
  ${emailMessageBlock("Review", content)}
  <p style="margin:20px 0 0;font-size:16px;line-height:1.65;">
    ${emailCtaButton("Open in Studio", studioUrl)}
  </p>
  <p style="margin:16px 0 0;font-size:14px;line-height:1.55;color:${emailBrand.warmMist};">
    Document ID: ${escapeHtml(documentId)} · Status: pending
  </p>`;

  return wrapBrandedEmail({
    eyebrow: "Review submission",
    title: clientName,
    bodyHtml,
    header: "dark",
    footerNote: "Publish or discard from Studio → Customer Reviews → Review submissions.",
  });
}
