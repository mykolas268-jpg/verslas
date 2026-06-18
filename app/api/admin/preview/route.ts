import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/admin/auth';
import { readJson, errorMessage } from '@/lib/admin/http';
import { renderPreviewHtml } from '@/lib/admin/preview-markdown';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Neautorizuota.' }, { status: 401 });
  }

  const payload = await readJson(req);
  const body =
    typeof (payload as { body?: unknown })?.body === 'string'
      ? (payload as { body: string }).body
      : '';

  try {
    return NextResponse.json({ html: await renderPreviewHtml(body) });
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 422 });
  }
}
