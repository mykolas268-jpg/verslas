import { NextResponse } from 'next/server';
import {
  createSessionToken,
  verifyPassword,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from '@/lib/admin/auth';
import { isAdminConfigured } from '@/lib/admin/config';
import { readJson } from '@/lib/admin/http';

export const dynamic = 'force-dynamic';

// Best-effort in-memory rate limit (per server instance).
const attempts = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

export async function POST(req: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: 'Administravimas nesukonfigūruotas (trūksta ADMIN_PASSWORD / SESSION_SECRET).' },
      { status: 503 },
    );
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  const now = Date.now();
  const record = attempts.get(ip) ?? { count: 0, ts: now };
  if (now - record.ts > WINDOW_MS) {
    record.count = 0;
    record.ts = now;
  }
  if (record.count >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: 'Per daug bandymų. Pabandyk vėliau.' },
      { status: 429 },
    );
  }

  const payload = await readJson(req);
  const password =
    typeof (payload as { password?: unknown })?.password === 'string'
      ? (payload as { password: string }).password
      : '';

  if (!verifyPassword(password)) {
    record.count += 1;
    attempts.set(ip, record);
    return NextResponse.json({ error: 'Neteisingas slaptažodis.' }, { status: 401 });
  }

  attempts.delete(ip);
  try {
    const token = createSessionToken();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    });
    return res;
  } catch {
    // e.g. SESSION_SECRET too short — return a clean message, not a raw 500.
    return NextResponse.json(
      { error: 'Serverio konfigūracijos klaida (patikrink SESSION_SECRET).' },
      { status: 500 },
    );
  }
}
