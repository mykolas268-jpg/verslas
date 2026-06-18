import { notFound, redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/admin/auth';
import { getPostDraft } from '@/lib/admin/service';
import { AdminHeader } from '@/components/admin/admin-header';
import { PostEditor } from '@/components/admin/post-editor';

export const dynamic = 'force-dynamic';

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!(await isAuthenticated())) {
    redirect('/admin/login');
  }

  const { slug } = await params;
  const post = await getPostDraft(slug);
  if (!post) {
    notFound();
  }

  return (
    <>
      <AdminHeader />
      <main className="mx-auto max-w-content px-5 py-10 sm:px-8">
        <PostEditor mode="edit" initial={post} />
      </main>
    </>
  );
}
