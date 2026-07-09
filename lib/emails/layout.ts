import {
  emailBrand,
  emailLogoDimensions,
  getEmailBusinessName,
  getEmailLogoUrl,
  getEmailWebsiteUrl,
} from "@/lib/emails/brand";

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

type BrandedEmailOptions = {
  /** Short label above the title, e.g. "New enquiry" */
  eyebrow?: string;
  title: string;
  bodyHtml: string;
  /** `dark` = graphite header with inverted logo; `light` = logo on stone-white */
  header?: "dark" | "light";
  footerNote?: string;
  /** Internal notifications keep the footer site link; customer emails omit it. */
  showFooterLink?: boolean;
};

const bodyFont =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const contentPaddingX = "28px";

export function emailCtaButton(label: string, href: string): string {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;padding:12px 20px;border-radius:12px;background-color:${emailBrand.gold};color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;">${escapeHtml(label)}</a>`;
}

export function wrapBrandedEmail({
  eyebrow,
  title,
  bodyHtml,
  header = "light",
  footerNote,
  showFooterLink = true,
}: BrandedEmailOptions): string {
  const businessName = escapeHtml(getEmailBusinessName());
  const websiteUrl = escapeHtml(getEmailWebsiteUrl());
  const logoUrl = escapeHtml(getEmailLogoUrl(header === "dark" ? "inverted" : "default"));
  const eyebrowHtml = eyebrow
    ? `<p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:${emailBrand.gold};">${escapeHtml(eyebrow)}</p>`
    : "";
  const footerHtml = footerNote
    ? `<p style="margin:16px 0 0;font-size:14px;line-height:1.55;color:${emailBrand.warmMist};">${escapeHtml(footerNote)}</p>`
    : "";
  const footerLinkHtml = showFooterLink
    ? `<tr>
            <td style="padding:0 ${contentPaddingX} 28px;font-size:14px;line-height:1.5;color:${emailBrand.warmMist};">
              <p style="margin:0;">
                <a href="${websiteUrl}" style="color:${emailBrand.gold};text-decoration:none;font-weight:600;">${businessName}</a>
              </p>
            </td>
          </tr>`
    : "";

  const headerBg = header === "dark" ? emailBrand.graphite : emailBrand.stoneWhite;
  const headerPadding = `24px ${contentPaddingX} 20px`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:${emailBrand.parchment};font-family:${bodyFont};color:${emailBrand.graphite};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${emailBrand.parchment};padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:${emailBrand.stoneWhite};border:1px solid ${emailBrand.parchment};border-radius:16px;overflow:hidden;">
          <tr>
            <td align="left" style="background-color:${headerBg};padding:${headerPadding};">
              <a href="${websiteUrl}" style="text-decoration:none;">
                <img src="${logoUrl}" alt="${businessName}" width="${emailLogoDimensions.width}" height="${emailLogoDimensions.height}" style="display:block;width:${emailLogoDimensions.width}px;max-width:100%;height:auto;border:0;" />
              </a>
            </td>
          </tr>
          <tr>
            <td style="height:4px;background-color:${emailBrand.gold};font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:28px ${contentPaddingX} 24px;font-size:16px;line-height:1.65;color:${emailBrand.graphite};">
              ${eyebrowHtml}
              <h1 style="margin:0 0 18px;font-size:22px;line-height:1.3;font-weight:700;letter-spacing:-0.02em;color:${emailBrand.graphite};">${escapeHtml(title)}</h1>
              ${bodyHtml}
              ${footerHtml}
            </td>
          </tr>
          ${footerLinkHtml}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function emailDetailRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid ${emailBrand.parchment};vertical-align:top;">
      <p style="margin:0 0 4px;font-size:13px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:${emailBrand.warmMist};">${escapeHtml(label)}</p>
      <p style="margin:0;font-size:16px;line-height:1.55;color:${emailBrand.graphite};">${escapeHtml(value)}</p>
    </td>
  </tr>`;
}

export function emailMessageBlock(label: string, message: string): string {
  return `<div style="margin-top:20px;">
    <p style="margin:0 0 8px;font-size:13px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:${emailBrand.warmMist};">${escapeHtml(label)}</p>
    <div style="padding:16px 18px;background-color:${emailBrand.parchment};border-radius:12px;border:1px solid ${emailBrand.parchment};font-size:16px;line-height:1.65;color:${emailBrand.graphite};white-space:pre-wrap;">${escapeHtml(message)}</div>
  </div>`;
}
