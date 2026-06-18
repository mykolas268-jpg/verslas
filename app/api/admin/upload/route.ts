import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/admin/auth';
import { getStorage } from '@/lib/admin/storage';
import { slugify } from '@/lib/admin/slug';
import { errorMessage } from '@/lib/admin/http';

export const dynamic = 'force-dynamic';

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const EXTENSIONS: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
  'image/gif': 'gif',
};

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Neautorizuota.' }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Bloga užklausa.' }, { status: 400 });
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Failas nerastas.' }, { status: 400 });
  }
  const extension = EXTENSIONS[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: 'Netinkamas failo tipas (leidžiama: png, jpg, webp, avif, svg, gif).' },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Failas per didelis (maks. 2 MB).' }, { status: 413 });
  }

  const base = slugify(file.name.replace(/\.[^.]+$/, '')) || 'paveikslas';
  const name = `${base}-${Date.now().toString(36)}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const path = await getStorage().writeImage(name, buffer, `content: upload image ${name}`);
    return NextResponse.json({ path });
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}
