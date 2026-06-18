import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/admin/auth';
import {
  deletePost,
  getPostDraft,
  savePost,
  PostInputSchema,
} from '@/lib/admin/service';
import { readJson, errorMessage } from '@/lib/admin/http';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Neautorizuota.' }, { status: 401 });
  }
  const { slug } = await params;
  const post = await getPostDraft(slug);
  if (!post) {
    return NextResponse.json({ error: 'Straipsnis nerastas.' }, { status: 404 });
  }
  return NextResponse.json({ post });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Neautorizuota.' }, { status: 401 });
  }
  const { slug } = await params;
  const parsed = PostInputSchema.safeParse(await readJson(req));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((issue) => issue.message).join('; ') },
      { status: 400 },
    );
  }
  try {
    // Slug is immutable on update — keep the URL slug.
    const result = await savePost({ ...parsed.data, slug }, 'update');
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 400 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Neautorizuota.' }, { status: 401 });
  }
  const { slug } = await params;
  try {
    await deletePost(slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}
