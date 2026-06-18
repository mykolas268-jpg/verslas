# verslas.ai

A premium, Lithuanian-language content website for an AI-education brand. It is a
blog publishing concrete, example-driven articles about using AI in business, plus
a Courses section in a "coming soon / waitlist" state. The site is the top of a
funnel: articles softly drive readers toward a course/book.

All user-facing copy is **Lithuanian**. Code, comments, and commits are English.

---

## Tech stack

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | **Next.js 15** (App Router) | Static generation (SSG) for speed + SEO |
| Language | **TypeScript** (strict) | Type-safe content + components |
| Styling | **Tailwind CSS 3.4** + `@tailwindcss/typography` | Design tokens, prose styling |
| Content | **MDX** via `next-mdx-remote/rsc` | Markdown files in the repo, compiled at build |
| Syntax highlight | `rehype-pretty-code` + `shiki` | Build-time highlighting (zero client JS) |
| Frontmatter | `js-yaml` (CORE_SCHEMA) + **Zod** | Validated, fail-loud frontmatter |
| Search | Client-side filter over a generated index | No database needed |
| OG images | `next/og` (`ImageResponse`) | Dynamic PNG cards with Lithuanian glyphs |
| Tests | **Playwright** | Smoke tests against the built site |

**Stack note:** Tailwind **v3.4** (not v4) and the Next 15 / React 19 line were
chosen deliberately for maximum compatibility with the MDX + shiki toolchain, so
the production build is reliably green.

---

## Getting started

### Prerequisites

- Node.js 18.18+ (developed on Node 24)
- npm

### Install & run

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

### Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (SSG) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (`next/core-web-vitals`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test:e2e` | Playwright smoke tests (builds + serves automatically) |
| `npm run test:e2e:install` | Install the Playwright Chromium browser (run once) |

---

## Project structure

```
app/                       # App Router routes
  layout.tsx               # Root layout: fonts, theme boot script, header/footer
  page.tsx                 # Home (/)
  straipsniai/             # Blog index + [slug] article pages
  kursai/                  # Courses (coming-soon + waitlist)
  apie/                    # About
  not-found.tsx            # Custom Lithuanian 404
  opengraph-image.tsx      # Default OG image (next/og)
  sitemap.ts / robots.ts   # Auto-generated sitemap.xml + robots.txt
  globals.css              # Design tokens + base/prose/code styling
components/                # Reusable UI (CTA, ArticleCard, ArticleSearch, etc.)
content/straipsniai/       # Article .mdx files (the content you edit)
lib/                       # posts loader, frontmatter, search, site config, OG
public/images/             # Cover art + in-article illustrations (SVG)
assets/fonts/              # Inter woff subsets used only for OG image rendering
tests/e2e/                 # Playwright smoke tests
```

---

## Adding a new article

1. Create a file in `content/straipsniai/`, e.g. `mano-straipsnis.mdx`.
2. Add frontmatter at the top:

```mdx
---
title: "Straipsnio antraštė"
slug: mano-straipsnis            # lowercase ascii kebab-case; must be unique
date: 2026-06-17                 # YYYY-MM-DD
excerpt: "Trumpa santrauka kortelėms ir meta aprašymui."
tags: ["Tema", "Kita tema"]
cover: /images/mano-virselis.svg # optional; omit for an auto-generated cover
draft: false                     # true hides the post from the production build
---

Tavo turinys čia…
```

3. Write the body in Markdown/MDX. Supported out of the box:

   - **Headings, lists, links, bold/italic, tables** (GitHub-flavored Markdown).
   - **Code blocks** with syntax highlighting and an optional title:

     ````mdx
     ```python title="pavyzdys.py"
     print("labas")
     ```
     ````

   - **Callout boxes** (`info` | `tip` | `warning` | `sample`):

     ```mdx
     <Callout type="tip" title="Patarimas">

     Turinys su **paryškinimu**.

     </Callout>
     ```

   - **Images with captions** (lazy-loaded, optimized):

     ```mdx
     <ProseImage src="/images/schema.svg" alt="Aprašymas" caption="Paveikslo paantraštė." />
     ```

4. That's it — the post is picked up automatically. Reading time is computed,
   the search index updates, and the article appears newest-first.

**Validation:** frontmatter is validated with Zod at build time. A malformed or
missing field (or a duplicate slug) **fails the build loudly** with a clear
message naming the file and field. Drafts (`draft: true`) are excluded from
production builds but visible in `npm run dev`.

**Replace the samples:** `ai-klientu-aptarnavimas.mdx` and
`ai-produktu-aprasymai.mdx` are clearly marked sample articles (note the
`<Callout type="sample">` at the top). Delete or replace them with real content.

---

## Admin panel (`/admin`)

A built-in, login-protected editor for writing and publishing posts in the
browser — no need to touch files by hand.

**How it stores content (dual adapter):**

- **Locally** (or whenever `GITHUB_TOKEN` is unset) it writes the `.mdx` files
  straight to `content/straipsniai/` — great for authoring with `npm run dev`,
  then committing/pushing yourself.
- **In production**, with `GITHUB_TOKEN` + `GITHUB_REPO` set, "Publish" commits
  the post to your GitHub repo via the API, which triggers a Vercel rebuild
  (~1 min) — so you can edit from anywhere.

**Setup:**

1. Set env vars (see `.env.example`): `ADMIN_PASSWORD`, `SESSION_SECRET`, and —
   for production publishing — `GITHUB_TOKEN` (fine-grained PAT with *Contents:
   Read & Write* on the repo), `GITHUB_REPO` (`owner/repo`), `GITHUB_BRANCH`.
   Locally, drop these in `.env.local`.
2. Go to `/admin`, log in with `ADMIN_PASSWORD`.
3. Create/edit posts with a live MDX preview, set frontmatter fields, upload a
   cover image, toggle **Draft**, and **Publish**.

**Features:** session auth (signed httpOnly cookie, timing-safe password check,
login rate-limiting), the same Zod validation as the build (so you can't publish
a post that would break the build), Lithuanian slug generation, image upload, and
a true-to-site live preview (reuses the real MDX + shiki pipeline). `/admin` and
`/api` are `noindex` and excluded from `robots.txt`.

> Note: in production the server filesystem is read-only, so the GitHub adapter
> is what makes "publish from anywhere" work. Connect the repo to Vercel so each
> commit auto-deploys.

---

## Design & theming

- A warm editorial neutral palette with a single deep-teal accent.
- Tokens are defined once in `app/globals.css` as RGB channels and mapped to
  semantic Tailwind utilities (`bg-bg`, `text-ink`, `bg-accent`, …) in
  `tailwind.config.ts`. **Do not hardcode hex values in components.**
- **Dark mode** is fully supported (class-based, applied pre-paint by an inline
  script to avoid flashes) with a header toggle. Both themes are polished.
- Type pairing: **Fraunces** (serif headings) + **Inter** (sans body/UI), both
  loaded via `next/font` with the `latin-ext` subset for Lithuanian glyphs.
- Subtle scroll-reveal motion respects `prefers-reduced-motion`.

---

## SEO

- Per-page `<title>` + meta description (article values come from frontmatter).
- Open Graph + Twitter cards. Dynamic OG images are generated per article and a
  branded default via `next/og`.
- `sitemap.xml` and `robots.txt` are generated automatically.
- Article pages emit `BlogPosting` JSON-LD structured data.
- Set `NEXT_PUBLIC_SITE_URL` in production so canonical/OG/sitemap URLs are
  absolute and correct (see Deployment).

---

## Testing & verification

```bash
npm run typecheck     # 0 type errors
npm run lint          # 0 lint errors
npm run build         # all routes statically generate
npm run test:e2e:install   # once, to download Chromium
npm run test:e2e      # smoke tests against the built site
```

The Playwright suite asserts: every page loads with the right status + heading,
search filters (incl. the "nerasta" empty state), nav routes correctly, the
waitlist accepts input and submits without throwing, and the 375px mobile layout
has no horizontal overflow.

**Audited results:** Lighthouse Accessibility / Best Practices / SEO = **100**
(home and article, desktop + mobile); Core Web Vitals **LCP ~0.2s**, **CLS 0.00**
on a local production build.

---

## Deployment (Vercel)

1. Push the repo to GitHub/GitLab/Bitbucket.
2. Import the project at <https://vercel.com/new> — the Next.js preset is detected
   automatically; no build configuration needed.
3. Add an environment variable:
   - `NEXT_PUBLIC_SITE_URL` = your production origin, e.g. `https://verslas.ai`
4. Deploy. Articles are statically generated at build time, so adding/editing an
   `.mdx` file and pushing triggers a rebuild with the new content.

> Any static host that supports Next.js output works; Vercel is the smoothest.

---

## Security note

**Response headers** are configured in `next.config.mjs` for every route:
`Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`,
`X-Frame-Options: DENY`, `Referrer-Policy`, and `Permissions-Policy` (and
`x-powered-by` is disabled). The CSP allows `'unsafe-inline'` for scripts because
the site is fully static and Next injects inline bootstrap scripts; a nonce-based
CSP would force dynamic rendering with no real benefit here (no user input, no
untrusted HTML rendered).

`npm audit` reports two **moderate** advisories, both originating from the
`postcss` copy **bundled inside Next.js** (used only to process our own
first-party CSS). The only "fix" npm offers is downgrading Next.js to a 9.x
release, which would reintroduce a patched high-severity CVE — so it is
intentionally left as-is until Next ships an update. Our direct dependencies are
clean, and the unmaintained `gray-matter` (which bundled a vulnerable
`js-yaml@3`) was replaced with a tiny first-party frontmatter parser over the
maintained `js-yaml@4`.

---

## TODOs left for later

- **Waitlist backend** — `components/waitlist-form.tsx` has a placeholder submit
  handler (`// TODO: connect backend`). Wire it to a real provider (an API route +
  Resend / ConvertKit / Mailchimp, etc.). The UI is final.
- **Real course data** — `lib/courses.ts` holds placeholder "coming soon" courses.
  Flip `status` to `available` and add an `href` when a course is ready; the card
  layout already supports it.
- **Real articles** — replace the two sample `.mdx` files with real content.
- **Analytics** — add your analytics/consent solution (e.g. Vercel Analytics,
  Plausible) in `app/layout.tsx`.
- **Social handle** — update `siteConfig.social.twitter` in `lib/site.ts`.
```
