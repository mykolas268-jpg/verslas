import { siteConfig } from './site';

/**
 * Browser-side helpers shared by the order and waitlist forms.
 */

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * The article the visitor came from, used to attribute inquiries to articles
 * without cookies or analytics. Article CTAs link here with `?straipsnis=<slug>`
 * (client-side navigation does not update document.referrer); a same-origin
 * referrer covers full page loads.
 */
export function sourceArticlePath(): string {
  if (typeof window === 'undefined') return '';
  const slug = new URLSearchParams(window.location.search).get('straipsnis');
  if (slug && SLUG_RE.test(slug)) return `/straipsniai/${slug}`;
  if (!document.referrer) return '';
  try {
    const referrer = new URL(document.referrer);
    if (referrer.origin !== window.location.origin) return '';
    return referrer.pathname.startsWith('/straipsniai/') ? referrer.pathname : '';
  } catch {
    return '';
  }
}

export type SubmitResult = 'sent' | 'fallback' | 'error';

/**
 * Posts an inquiry to /api/uzklausa. Returns 'fallback' when server delivery
 * is not configured or failed, so the caller can open a prefilled email.
 */
export async function submitInquiry(payload: Record<string, string>): Promise<SubmitResult> {
  try {
    const response = await fetch('/api/uzklausa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (response.ok) return 'sent';
    if (response.status === 503 || response.status === 502) return 'fallback';
    return 'error';
  } catch {
    return 'fallback';
  }
}

export function mailtoHref(subject: string, bodyLines: string[]): string {
  const params = new URLSearchParams({ subject, body: bodyLines.join('\n') });
  // URLSearchParams encodes spaces as "+"; mail clients expect %20.
  return `mailto:${siteConfig.contactEmail}?${params.toString().replace(/\+/g, '%20')}`;
}
