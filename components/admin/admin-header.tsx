'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IconSpark } from '@/components/icons';

export function AdminHeader() {
  const router = useRouter();

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-fg">
            <IconSpark size={18} />
          </span>
          <span>
            verslas<span className="text-accent">.ai</span>
          </span>
          <span className="ml-1 hidden rounded-full border border-line px-2 py-0.5 text-xs font-normal text-muted sm:inline">
            Administravimas
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="rounded-full border border-line bg-card px-3 py-2 text-sm text-ink transition-colors hover:bg-surface"
          >
            Žiūrėti svetainę
          </Link>
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-line bg-card px-3 py-2 text-sm text-muted transition-colors hover:text-ink"
          >
            Atsijungti
          </button>
        </div>
      </div>
    </header>
  );
}
