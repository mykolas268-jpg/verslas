import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/admin/auth';
import { AdminHeader } from '@/components/admin/admin-header';
import { PostEditor } from '@/components/admin/post-editor';

export const dynamic = 'force-dynamic';

export default async function NewPostPage() {
  if (!(await isAuthenticated())) {
    redirect('/admin/login');
  }

  return (
    <>
      <AdminHeader />
      <main className="mx-auto max-w-content px-5 py-10 sm:px-8">
        <PostEditor mode="create" />
      </main>
    </>
  );
}
