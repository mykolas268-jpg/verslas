import { z } from 'zod';

/**
 * Server-side inquiry delivery (order form, waitlists). Delivery is enabled
 * only when TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are set; until then the
 * API answers 503 and the forms fall back to a prefilled email.
 *
 * When enabling delivery, update app/privatumo-politika to name the provider.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const InquirySchema = z.object({
  kind: z.enum(['order', 'waitlist']),
  name: z.string().trim().max(120).optional().default(''),
  email: z.string().trim().max(200).regex(EMAIL_RE, 'Neteisingas el. pašto adresas.'),
  phone: z.string().trim().max(40).optional().default(''),
  message: z.string().trim().max(3000).optional().default(''),
  /** Which waitlist, e.g. "kursai" or "knyga". */
  list: z.string().trim().max(40).optional().default(''),
  /** Site path the visitor came from (article attribution). */
  source: z.string().trim().max(200).optional().default(''),
  /** Honeypot: real visitors leave it empty. */
  website: z.string().optional().default(''),
});

export type Inquiry = z.infer<typeof InquirySchema>;

export function isInquiryDeliveryConfigured(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN?.trim() && process.env.TELEGRAM_CHAT_ID?.trim());
}

export function formatInquiry(inquiry: Inquiry): string {
  const title =
    inquiry.kind === 'order'
      ? 'Nauja užklausa: reklaminis video'
      : `Laukiančiųjų sąrašas${inquiry.list ? `: ${inquiry.list}` : ''}`;
  return [
    title,
    inquiry.name ? `Vardas: ${inquiry.name}` : null,
    `El. paštas: ${inquiry.email}`,
    inquiry.phone ? `Telefonas: ${inquiry.phone}` : null,
    inquiry.source ? `Atėjo iš: ${inquiry.source}` : null,
    inquiry.message ? `\n${inquiry.message}` : null,
  ]
    .filter((line): line is string => line !== null)
    .join('\n');
}

/** Sends the inquiry to the owner's Telegram chat. Throws on failure. */
export async function deliverInquiry(inquiry: Inquiry): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) throw new Error('Inquiry delivery is not configured.');

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: formatInquiry(inquiry),
      disable_web_page_preview: true,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    throw new Error(`Telegram responded ${response.status}`);
  }
}
