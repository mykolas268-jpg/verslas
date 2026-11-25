import { NextResponse } from 'next/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

/**
 * Supabase Edge Function that validates and stores the submission. It holds
 * the database credentials in its own runtime, so nothing secret is needed
 * here and no Vercel environment variable has to be configured. Override with
 * LEADS_ENDPOINT if the function is ever moved.
 */
const LEADS_ENDPOINT =
  process.env.LEADS_ENDPOINT ??
  'https://kbbfeictjgvmpkhzbewk.supabase.co/functions/v1/leads';

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

  let response: Response;
  try {
    response = await fetch(LEADS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': req.headers.get('user-agent')?.slice(0, 300) ?? 'verslas.ai',
      },
      body: JSON.stringify({
        type: lead.type,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        message: lead.message,
        sourcePath: lead.sourcePath,
      }),
    });
  } catch (error) {
    console.error('[leads] upstream unreachable', error);
    return NextResponse.json(
      { error: 'Nepavyko išsaugoti užklausos. Pabandyk dar kartą.' },
      { status: 502 },
    );
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    console.error('[leads] upstream rejected', response.status, detail.slice(0, 500));
    return NextResponse.json(
      { error: 'Nepavyko išsaugoti užklausos. Pabandyk dar kartą.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
