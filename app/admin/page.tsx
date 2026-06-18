import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/admin/auth';
import { listPosts } from '@/lib/admin/service';
import { getStorage } from '@/lib/admin/storage';
import { AdminHeader } from '@/components/admin/admin-header';
import { PostList } from '@/components/admin/post-list';
import { IconArrowRight } from '@/components/icons';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  if (!(await isAuthenticated())) {
    redirect('/admin/login');
  }

  const posts = await listPosts();
  const storageKind = getStorage().kind;

  return (
    <>
      <AdminHeader />
      <main className="mx-auto max-w-content px-5 py-10 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl">Straipsniai</h1>
            <p className="mt-1 max-w-xl text-sm text-muted">
              {storageKind === 'github'
                ? 'Publikuojant pakeitimai įrašomi į „GitHub" ir svetainė automatiškai sukuriama iš naujo.'
                : 'Vietinis režimas: pakeitimai įrašomi į failus (vėliau nusiųsk juos į „GitHub").'}
            </p>
          </div>
          <Link href="/admin/new" className="btn-accent">
            Naujas straipsnis
            <IconArrowRight size={18} />
          </Link>
        </div>

        <div className="mt-8">
          <PostList initialPosts={posts} />
        </div>
      </main>
    </>
  );
}
