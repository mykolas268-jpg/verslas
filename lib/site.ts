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
  tagline: 'Dirbtinis intelektas tavo verslui - be teorijos, su pavyzdžiais.',
  /** Default meta description (Lithuanian). */
  description:
    'Konkretūs, pavyzdžiais paremti straipsniai apie tai, kaip naudoti dirbtinį intelektą versle. Realūs scenarijai, žingsnis po žingsnio ir paruošti promptai.',
  locale: 'lt_LT',
  lang: 'lt',
  /**
   * Where order/contact submissions go. Override on Vercel with
   * NEXT_PUBLIC_CONTACT_EMAIL; the branded fallback can be set up as a
   * forwarding address on the domain.
   */
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'info@aiverslui.lt',
  nav: [
    { href: '/', label: 'Pradžia' },
    { href: '/konsultacija', label: 'Konsultacija' },
    { href: '/straipsniai', label: 'Straipsniai' },
    { href: '/kursai', label: 'Kursai' },
    { href: '/apie', label: 'Apie' },
  ] satisfies NavItem[],
  /** Default values for the reusable <CTA /> funnel component. */
  cta: {
    eyebrow: 'Nemokama konsultacija',
    title: 'Nemokama AI konsultacija tavo verslui',
    description:
      '30 min. pokalbis apie tai, kaip AI gali padėti konkrečiai tavo verslui. Be teorijos, be įsipareigojimų - tik praktiniai patarimai.',
    label: 'Užsiregistruok konsultacijai',
    href: '/konsultacija',
  },
  author: {
    name: 'verslas.ai komanda',
  },
  social: {
    twitter: '@verslasai',
  },
} as const;

export type SiteConfig = typeof siteConfig;
