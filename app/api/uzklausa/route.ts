import { NextResponse } from 'next/server';
import {
  InquirySchema,
  deliverInquiry,
  isInquiryDeliveryConfigured,
} from '@/lib/inquiry';

export const dynamic = 'force-dynamic';

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
// Best-effort, per server instance. Enough to blunt a single noisy client.
const recent = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  hits.push(now);
  recent.set(key, hits);
  return hits.length > MAX_PER_WINDOW;
}

function sameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true; // non-browser clients; the honeypot and limits still apply
  try {
    return new URL(origin).host === new URL(req.url).host;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) {
    return NextResponse.json({ error: 'Neleistinas šaltinis.' }, { status: 403 });
  }

  let body: unknown = null;
  try {
    body = await req.json();
  } catch {
    // handled by validation below
  }
  const parsed = InquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((issue) => issue.message).join('; ') },
      { status: 400 },
    );
  }

  // Bots fill every field; pretend success so they don't retry.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  if (!isInquiryDeliveryConfigured()) {
    return NextResponse.json({ fallback: 'mailto' }, { status: 503 });
  }

  const client = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(client)) {
    return NextResponse.json(
      { error: 'Per daug užklausų. Pabandyk po kelių minučių.' },
      { status: 429 },
    );
  }

  try {
    await deliverInquiry(parsed.data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ fallback: 'mailto' }, { status: 502 });
  }
}
