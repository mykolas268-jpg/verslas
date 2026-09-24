import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAdjacentPosts,
  getAllSlugs,
  getPostBySlug,
  lastModified,
} from '@/lib/posts';
import { getAuthor } from '@/lib/authors';
import { siteConfig } from '@/lib/site';
import { articleTitle } from '@/lib/seo';
import { articleJsonLd } from '@/lib/structured-data';
import { formatDateLt } from '@/lib/format';
import { MdxContent } from '@/components/mdx-content';
import { CTA } from '@/components/cta';
import { Tag } from '@/components/tag';
import { JsonLd } from '@/components/json-ld';
import { ArticleFaq, ArticleSources } from '@/components/article-extras';
import { IconArrowLeft, IconArrowRight, IconClock } from '@/components/icons';

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: 'Straipsnis nerastas' };
  }

  const canonical = `/straipsniai/${post.slug}`;
  const author = getAuthor(post.author);
  return {
    title: articleTitle(post),
    description: post.excerpt,
    keywords: post.tags,
    ...(author ? { authors: [{ name: author.name }] } : {}),
    alternates: { canonical },
    openGraph: {
      type: 'article',
      url: `${siteConfig.url}${canonical}`,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      modifiedTime: lastModified(post),
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { prev, next } = getAdjacentPosts(slug);

  const author = getAuthor(post.author);
  const jsonLd = articleJsonLd(post, author);

  return (
    <article className="mx-auto max-w-content px-5 py-10 sm:px-8 sm:py-14">
      <JsonLd data={jsonLd} />

      <div className="mx-auto max-w-prose">
        <Link
          href="/straipsniai"
          className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          <IconArrowLeft size={16} />
          Visi straipsniai
        </Link>

        <header className="mt-6">
          {post.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </div>
          ) : null}
          <h1 className="mt-4 font-serif text-4xl leading-[1.1] sm:text-5xl">
            {post.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            {author ? (
              <>
                <span className="font-medium text-ink">{author.name}</span>
                <span aria-hidden="true">·</span>
              </>
            ) : null}
            <time dateTime={post.date}>{formatDateLt(post.date)}</time>
            {post.updated && post.updated !== post.date ? (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  Atnaujinta{' '}
                  <time dateTime={post.updated}>{formatDateLt(post.updated)}</time>
                </span>
              </>
            ) : null}
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <IconClock size={14} />
              {post.readingLabel}
            </span>
          </div>
          {post.aiAssisted && author ? (
            <p className="mt-3 text-sm text-muted">
              Parengta naudojant dirbtinį intelektą. Faktus patikrino ir
              redagavo {author.name}.
            </p>
          ) : null}
          {post.changeNote && post.updated ? (
            <p className="mt-4 rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-ink">
              <span className="font-semibold">
                Kas pasikeitė ({formatDateLt(post.updated)}):
              </span>{' '}
              {post.changeNote}
            </p>
          ) : null}
        </header>
      </div>

      {post.cover ? (
        <div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-3xl border border-line bg-surface">
          <div className="relative aspect-[16/10]">
            <Image
              src={post.cover}
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        </div>
      ) : null}

      <div className="mx-auto mt-10 max-w-prose">
        <div className="prose max-w-none prose-headings:font-serif prose-headings:tracking-tight prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0">
          <MdxContent source={post.content} />
          <ArticleFaq items={post.faq} />
          <ArticleSources sources={post.sources} />
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-prose">
        <CTA />
      </div>

      {prev || next ? (
        <nav
          aria-label="Straipsnių navigacija"
          className="mx-auto mt-12 max-w-prose"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {prev ? (
              <Link
                href={`/straipsniai/${prev.slug}`}
                className="group rounded-2xl border border-line bg-card p-5 transition-colors hover:border-accent"
              >
                <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-muted">
                  <IconArrowLeft size={14} />
                  Ankstesnis
                </span>
                <p className="mt-2 font-serif text-lg leading-snug transition-colors group-hover:text-accent">
                  {prev.title}
                </p>
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}

            {next ? (
              <Link
                href={`/straipsniai/${next.slug}`}
                className="group rounded-2xl border border-line bg-card p-5 transition-colors hover:border-accent sm:text-right"
              >
                <span className="inline-flex w-full items-center gap-1 text-xs uppercase tracking-wide text-muted sm:justify-end">
                  Kitas
                  <IconArrowRight size={14} />
                </span>
                <p className="mt-2 font-serif text-lg leading-snug transition-colors group-hover:text-accent">
                  {next.title}
                </p>
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}
          </div>
        </nav>
      ) : null}
    </article>
  );
}
