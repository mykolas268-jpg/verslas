import { NextResponse } from 'next/server';
import {
  InquirySchema,
  deliverInquiry,
  isInquiryDeliveryConfigured,
} from '@/lib/inquiry';

export const dynamic = 'force-dynamic';

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
/** All clients together: caps a flood from many addresses (Telegram spam). */
const MAX_TOTAL_PER_WINDOW = 30;
const MAX_TRACKED_CLIENTS = 5_000;
// Best-effort, per server instance. Enough to blunt a noisy client or a burst.
const recent = new Map<string, number[]>();
let total: number[] = [];

function rateLimited(key: string): boolean {
  const now = Date.now();
  total = total.filter((time) => now - time < WINDOW_MS);
  if (recent.size > MAX_TRACKED_CLIENTS) {
    // Drop clients with no hit inside the window so the map cannot grow forever.
    for (const [client, times] of recent) {
      if (!times.some((time) => now - time < WINDOW_MS)) recent.delete(client);
    }
  }
  const hits = (recent.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  hits.push(now);
  recent.set(key, hits);
  if (hits.length > MAX_PER_WINDOW || total.length >= MAX_TOTAL_PER_WINDOW) return true;
  total.push(now);
  return false;
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
