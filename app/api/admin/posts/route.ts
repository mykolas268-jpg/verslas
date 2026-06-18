import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/admin/auth';
import { listPosts, savePost, PostInputSchema } from '@/lib/admin/service';
import { readJson, errorMessage } from '@/lib/admin/http';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Neautorizuota.' }, { status: 401 });
  }
  try {
    return NextResponse.json({ posts: await listPosts() });
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Neautorizuota.' }, { status: 401 });
  }
  const parsed = PostInputSchema.safeParse(await readJson(req));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((issue) => issue.message).join('; ') },
      { status: 400 },
    );
  }
  try {
    const result = await savePost(parsed.data, 'create');
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 400 });
  }
}
