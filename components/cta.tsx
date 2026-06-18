import Link from 'next/link';
import { siteConfig } from '@/lib/site';
import { IconArrowRight, IconSpark } from './icons';

interface CTAProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  label?: string;
  href?: string;
}

/**
 * The single reusable funnel CTA. Used on the home page, at the end of every
 * article, and on the courses page. All copy is configurable; sensible
 * Lithuanian defaults come from siteConfig.cta.
 */
export function CTA({
  eyebrow = siteConfig.cta.eyebrow,
  title = siteConfig.cta.title,
  description = siteConfig.cta.description,
  label = siteConfig.cta.label,
  href = siteConfig.cta.href,
}: CTAProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-line bg-surface px-6 py-12 sm:px-12 sm:py-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 text-accent/10"
      >
        <IconSpark size={220} />
      </div>

      <div className="relative max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {eyebrow}
        </p>
        <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">
          {title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted">{description}</p>
        <Link href={href} className="btn-accent mt-7">
          {label}
          <IconArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
