import Image from 'next/image';
import Link from 'next/link';
import { getAllPostsMeta } from '@/lib/posts';
import { siteConfig } from '@/lib/site';
import { formatDateLt } from '@/lib/format';
import { ArticleCard } from '@/components/article-card';
import { CTA } from '@/components/cta';
import { Reveal } from '@/components/reveal';
import { Tag } from '@/components/tag';
import { IconArrowRight, IconClock, IconSpark } from '@/components/icons';

export default function HomePage() {
  const posts = getAllPostsMeta();
  const featured = posts[0];
  const latest = posts.slice(1, 7);

  return (
    <div className="mx-auto max-w-content px-5 sm:px-8">
      {/* Hero */}
      <section className="relative py-20 sm:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-8 -z-10 hidden text-accent/[0.06] lg:block"
        >
          <IconSpark size={340} />
        </div>
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1 text-xs font-medium text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Dirbtinis intelektas versle
          </p>
          <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-[1.05] sm:text-6xl">
            {siteConfig.tagline}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Konkretūs scenarijai, žingsnis po žingsnio ir paruošti promptai,
            kuriuos gali pritaikyti savo versle jau šiandien.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/straipsniai" className="btn-accent">
              Skaityti straipsnius
              <IconArrowRight size={18} />
            </Link>
            <Link href="/apie" className="btn-outline">
              Apie projektą
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Featured article */}
      {featured ? (
        <section aria-labelledby="featured-heading" className="py-8">
          <Reveal>
            <div className="mb-6 flex items-baseline justify-between gap-4">
              <h2
                id="featured-heading"
                className="text-xs font-semibold uppercase tracking-[0.2em] text-muted"
              >
                Naujausias straipsnis
              </h2>
              <Link
                href="/straipsniai"
                className="text-sm text-accent transition-opacity hover:opacity-80"
              >
                Visi straipsniai →
              </Link>
            </div>

            <article className="group relative grid overflow-hidden rounded-3xl border border-line bg-card md:grid-cols-2">
              <div className="relative aspect-[16/10] bg-surface md:aspect-auto">
                {featured.cover ? (
                  <Image
                    src={featured.cover}
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="grid h-full place-items-center bg-gradient-to-br from-accent/20 to-accent/5">
                    <IconSpark size={120} />
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center gap-4 p-6 sm:p-10">
                <div className="flex flex-wrap gap-2">
                  {featured.tags.slice(0, 3).map((tag) => (
                    <Tag key={tag} label={tag} />
                  ))}
                </div>
                <h3 className="font-serif text-2xl leading-snug sm:text-3xl">
                  <Link
                    href={`/straipsniai/${featured.slug}`}
                    className="after:absolute after:inset-0 after:content-['']"
                  >
                    {featured.title}
                  </Link>
                </h3>
                <p className="leading-relaxed text-muted">{featured.excerpt}</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                  <time dateTime={featured.date}>{formatDateLt(featured.date)}</time>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1">
                    <IconClock size={13} />
                    {featured.readingLabel}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
                  Skaityti
                  <IconArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </span>
              </div>
            </article>
          </Reveal>
        </section>
      ) : null}

      {/* Latest grid */}
      {latest.length > 0 ? (
        <section aria-labelledby="latest-heading" className="py-12">
          <h2
            id="latest-heading"
            className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-muted"
          >
            Daugiau straipsnių
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((post, index) => (
              <Reveal key={post.slug} delay={index * 70}>
                <ArticleCard post={post} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {/* Funnel CTA */}
      <Reveal>
        <div className="py-16">
          <CTA />
        </div>
      </Reveal>
    </div>
  );
}
