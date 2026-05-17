/** Display-friendly spacing for common UK mobile numbers (e.g. 07572 138 829). */
export function formatUkPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 11 && digits.startsWith("07")) {
    return `${digits.slice(0, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }

  return phone.trim();
}

export function phoneTelHref(phone: string): string {
  return `tel:${phone.replace(/\s/g, "")}`;
}
