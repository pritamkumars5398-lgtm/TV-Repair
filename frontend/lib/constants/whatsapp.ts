const DEFAULT_WHATSAPP_NUMBER = '918586887887';

// wa.me needs the number in international format with digits only (e.g. 918586887887).
// Normalise whatever is configured: strip "+", spaces, dashes and add the 91 prefix for 10-digit numbers.
function normaliseNumber(raw: string | undefined): string {
  const digits = (raw || '').replace(/\D/g, '').replace(/^0+/, '');
  if (digits.length === 10) return `91${digits}`;
  if (digits.length >= 11) return digits;
  return DEFAULT_WHATSAPP_NUMBER;
}

export const WHATSAPP_NUMBER = normaliseNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);

export function getWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
