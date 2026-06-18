'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { AdminPostSummary } from '@/lib/admin/service';
import { formatDateLt } from '@/lib/format';

export function PostList({ initialPosts }: { initialPosts: AdminPostSummary[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [busy, setBusy] = useState<string | null>(null);

  async function onDelete(slug: string) {
    if (
      !window.confirm(
        `Ištrinti straipsnį „${slug}"? Šio veiksmo atšaukti negalėsi.`,
      )
    ) {
      return;
    }
    setBusy(slug);
    try {
      const res = await fetch(`/api/admin/posts/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts((current) => current.filter((post) => post.slug !== slug));
      } else {
        window.alert('Nepavyko ištrinti straipsnio.');
      }
    } finally {
      setBusy(null);
    }
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line p-12 text-center text-muted">
        Dar nėra straipsnių. Sukurk pirmą!
      </div>
    );
  }

  return (
    <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
      {posts.map((post) => (
        <li
          key={post.slug}
          className="flex flex-wrap items-center gap-3 bg-card p-4"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  post.draft
                    ? 'bg-surface text-muted'
                    : 'bg-accent/15 text-accent'
                }`}
              >
                {post.draft ? 'Juodraštis' : 'Publikuota'}
              </span>
              {!post.valid ? (
                <span className="rounded-full bg-amber-400/25 px-2 py-0.5 text-xs text-amber-800 dark:text-amber-200">
                  Frontmatter klaida
                </span>
              ) : null}
            </div>
            <p className="mt-1 truncate font-serif text-lg">{post.title}</p>
            <p className="truncate text-xs text-muted">
              /{post.slug} · {post.date ? formatDateLt(post.date) : '—'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/admin/edit/${post.slug}`}
              className="rounded-full border border-line bg-card px-3 py-2 text-sm text-ink transition-colors hover:bg-surface"
            >
              Redaguoti
            </Link>
            <button
              type="button"
              onClick={() => onDelete(post.slug)}
              disabled={busy === post.slug}
              className="rounded-full border border-line px-3 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
            >
              {busy === post.slug ? 'Trinama…' : 'Ištrinti'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
