import { NextResponse } from 'next/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const BaseSchema = z.object({
  type: z.enum(['consultation', 'waitlist']),
  name: z.string().trim().max(200).optional().default(''),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().max(60).optional().default(''),
  message: z.string().trim().max(5000).optional().default(''),
  sourcePath: z.string().trim().max(200).optional().default(''),
  /** Hidden field: humans leave it empty, bots fill it in. */
  company: z.string().max(200).optional().default(''),
});

const LeadSchema = BaseSchema.refine(
  (value) =>
    value.type !== 'consultation' ||
    (value.name.length > 0 && value.message.length >= 5),
  { message: 'Konsultacijos užklausai reikia vardo ir žinutės.' },
);

export async function POST(req: Request) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error('[leads] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY nenustatyti');
    return NextResponse.json(
      { error: 'Formos saugojimas kol kas nesukonfigūruotas.' },
      { status: 503 },
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Bloga užklausa.' }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Patikrink užpildytus laukus.' }, { status: 400 });
  }

  const lead = parsed.data;

  // Honeypot hit - pretend success so the bot does not retry.
  if (lead.company.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      type: lead.type,
      name: lead.name || null,
      email: lead.email,
      phone: lead.phone || null,
      message: lead.message || null,
      source_path: lead.sourcePath || null,
      user_agent: req.headers.get('user-agent')?.slice(0, 500) ?? null,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    console.error('[leads] Supabase insert failed', response.status, detail.slice(0, 500));
    return NextResponse.json(
      { error: 'Nepavyko išsaugoti užklausos. Pabandyk dar kartą.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
