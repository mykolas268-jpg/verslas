/**
 * Central site configuration. All user-facing copy here is Lithuanian.
 * The base URL is overridable per-environment via NEXT_PUBLIC_SITE_URL
 * (set this on Vercel for correct canonical / OG / sitemap URLs).
 */

export interface NavItem {
  href: string;
  label: string;
}

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://verslas.ai';

export const siteConfig = {
  name: 'verslas.ai',
  url: rawUrl.replace(/\/$/, ''),
  /** One-line brand promise used on the home hero. */
  tagline: 'Dirbtinis intelektas tavo verslui — be teorijos, su pavyzdžiais.',
  /** Default meta description (Lithuanian). */
  description:
    'Konkretūs, pavyzdžiais paremti straipsniai apie tai, kaip naudoti dirbtinį intelektą versle. Realūs scenarijai, žingsnis po žingsnio ir paruošti promptai.',
  locale: 'lt_LT',
  lang: 'lt',
  nav: [
    { href: '/', label: 'Pradžia' },
    { href: '/straipsniai', label: 'Straipsniai' },
    { href: '/kursai', label: 'Kursai' },
    { href: '/apie', label: 'Apie' },
  ] satisfies NavItem[],
  /** Default values for the reusable <CTA /> funnel component. */
  cta: {
    eyebrow: 'Nori giliau?',
    title: 'Peržiūrėk mūsų kursą',
    description:
      'Praktinis kursas, kuris padės pritaikyti dirbtinį intelektą tavo versle — nuo pirmo prompto iki realaus rezultato.',
    label: 'Peržiūrėk mūsų kursą',
    href: '/kursai',
  },
  author: {
    name: 'verslas.ai komanda',
  },
  social: {
    twitter: '@verslasai',
  },
} as const;

export type SiteConfig = typeof siteConfig;
