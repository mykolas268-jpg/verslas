'use client';

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { PostMeta } from '@/lib/posts';
import { filterPosts } from '@/lib/search';
import { ArticleCard } from './article-card';
import { IconSearch } from './icons';

const PAGE_SIZE = 12;

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
        active
          ? 'border-accent bg-accent text-accent-fg'
          : 'border-line bg-card text-muted hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}

interface ArticleSearchProps {
  posts: PostMeta[];
  tags: string[];
}

export function ArticleSearch({ posts, tags }: ArticleSearchProps) {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const results = useMemo(
    () => filterPosts(posts, query, activeTag),
    [posts, query, activeTag],
  );
  const visible = results.slice(0, visibleCount);

  function resetPaging() {
    setVisibleCount(PAGE_SIZE);
  }

  function clearFilters() {
    setQuery('');
    setActiveTag(null);
    resetPaging();
  }

  return (
    <div>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
          <IconSearch size={18} />
        </span>
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            resetPaging();
          }}
          placeholder="Ieškoti straipsnių…"
          aria-label="Ieškoti straipsnių"
          className="field !rounded-2xl pl-11"
        />
      </div>

      {tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <Chip active={activeTag === null} onClick={() => { setActiveTag(null); resetPaging(); }}>
            Visi
          </Chip>
          {tags.map((tag) => (
            <Chip
              key={tag}
              active={activeTag === tag}
              onClick={() => {
                setActiveTag(activeTag === tag ? null : tag);
                resetPaging();
              }}
            >
              {tag}
            </Chip>
          ))}
        </div>
      ) : null}

      <p className="mt-6 text-sm text-muted" aria-live="polite">
        {results.length > 0 ? `Rasta straipsnių: ${results.length}` : ' '}
      </p>

      {results.length === 0 ? (
        <div className="mt-2 rounded-2xl border border-dashed border-line bg-surface/50 px-6 py-16 text-center">
          <p className="text-lg text-ink">Pagal jūsų užklausą straipsnių nerasta.</p>
          <p className="mt-2 text-sm text-muted">
            Pabandyk kitą raktažodį arba išvalyk filtrus.
          </p>
          <button type="button" onClick={clearFilters} className="btn-outline mt-6">
            Išvalyti filtrus
          </button>
        </div>
      ) : (
        <>
          <div className="mt-2 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((post, index) => (
              <ArticleCard key={post.slug} post={post} priority={index === 0} />
            ))}
          </div>

          {results.length > visibleCount ? (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                className="btn-outline"
              >
                Rodyti daugiau
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
