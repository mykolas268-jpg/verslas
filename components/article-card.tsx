import Image from 'next/image';
import Link from 'next/link';
import type { PostMeta } from '@/lib/posts';
import { formatDateLt } from '@/lib/format';
import { IconArrowRight, IconClock, IconSpark } from './icons';
import { Tag } from './tag';

/** Deterministic hue (0–359) derived from the slug, for the no-cover fallback. */
function hueFromSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) % 360;
  }
  return hash;
}

function CardCover({ post, priority }: { post: PostMeta; priority?: boolean }) {
  if (post.cover) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        <Image
          src={post.cover}
          alt=""
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
          className="object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.03]"
        />
      </div>
    );
  }

  // Generated editorial panel when an author provides no cover image.
  const hue = hueFromSlug(post.slug);
  const monogram = post.title.trim().charAt(0).toUpperCase();
  return (
    <div
      className="relative grid aspect-[16/10] place-items-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, hsl(${hue} 32% 42%), hsl(${
          (hue + 40) % 360
        } 46% 30%))`,
      }}
    >
      <span
        aria-hidden="true"
        className="absolute -right-6 -top-6 text-white/15"
      >
        <IconSpark size={140} />
      </span>
      <span className="font-serif text-5xl text-white/90">{monogram}</span>
    </div>
  );
}

interface ArticleCardProps {
  post: PostMeta;
  /** Set on the first card for LCP image priority. */
  priority?: boolean;
}

export function ArticleCard({ post, priority = false }: ArticleCardProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-card transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-28px_rgb(0_0_0/0.35)]">
      <CardCover post={post} priority={priority} />

      <div className="flex flex-1 flex-col gap-3 p-5">
        {post.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 2).map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        ) : null}

        <h3 className="font-serif text-xl leading-snug text-ink">
          <Link
            href={`/straipsniai/${post.slug}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {post.title}
          </Link>
        </h3>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted">
          {post.excerpt}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 text-xs text-muted">
          <time dateTime={post.date}>{formatDateLt(post.date)}</time>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <IconClock size={13} />
            {post.readingLabel}
          </span>
        </div>

        <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-accent">
          Skaityti
          <IconArrowRight
            size={16}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </span>
      </div>
    </article>
  );
}
