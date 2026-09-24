import fs from 'node:fs';
import path from 'node:path';
import readingTime from 'reading-time';
import { z } from 'zod';
import { parseFrontmatter } from './frontmatter';
import { readingLabelLt } from './format';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'straipsniai');

const IsoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be in YYYY-MM-DD format');

export const ArticleTypeSchema = z.enum(['guide', 'news', 'comparison', 'roundup']);
export type ArticleType = z.infer<typeof ArticleTypeSchema>;

const SourceSchema = z.object({
  title: z.string().min(1, 'source title is required'),
  url: z.string().url('source url must be an absolute URL'),
  publisher: z.string().min(1).optional(),
  date: IsoDateSchema.optional(),
});
export type ArticleSource = z.infer<typeof SourceSchema>;

const FaqItemSchema = z.object({
  q: z.string().min(1, 'faq question is required'),
  a: z.string().min(1, 'faq answer is required'),
});
export type FaqItem = z.infer<typeof FaqItemSchema>;

const EntitySchema = z.object({
  name: z.string().min(1, 'entity name is required'),
  sameAs: z.array(z.string().url()).default([]),
});
export type ArticleEntity = z.infer<typeof EntitySchema>;

/**
 * Frontmatter contract. Invalid frontmatter throws and fails the build loudly,
 * which is the intended behavior (no silently-broken posts in production).
 *
 * Everything after `draft` is optional and defaults to the pre-existing
 * behavior, so older articles build unchanged.
 */
export const FrontmatterSchema = z
  .object({
    title: z.string().min(1, 'title is required'),
    slug: z
      .string()
      .min(1, 'slug is required')
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'slug must be lowercase ascii kebab-case (e.g. "reklaminis-video-kaina")',
      ),
    date: IsoDateSchema,
    excerpt: z.string().min(1, 'excerpt is required'),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
    /** Last substantive update (YYYY-MM-DD). Drives dateModified and "Atnaujinta". */
    updated: IsoDateSchema.optional(),
    /** Short <title> override when `title` is too long for search results. */
    seoTitle: z.string().min(1).max(60, 'seoTitle must be 60 characters or fewer').optional(),
    type: ArticleTypeSchema.default('guide'),
    /** Key into lib/authors.ts. Omitted → organization byline (legacy behavior). */
    author: z.string().min(1).optional(),
    /** Topic cluster key (hub pages, breadcrumbs). */
    cluster: z.string().min(1).optional(),
    sources: z.array(SourceSchema).default([]),
    faq: z.array(FaqItemSchema).default([]),
    /** Key entities for JSON-LD `mentions` (sameAs only where accurate). */
    entities: z.array(EntitySchema).default([]),
    /** Shows the AI-assistance disclosure line under the byline. */
    aiAssisted: z.boolean().default(false),
    /** Visible note describing what changed in the last update. */
    changeNote: z.string().min(1).optional(),
  })
  .refine((data) => !data.updated || data.updated >= data.date, {
    message: 'updated must not be earlier than date',
    path: ['updated'],
  })
  .refine((data) => !data.aiAssisted || Boolean(data.author), {
    message: 'aiAssisted articles must name the responsible author',
    path: ['author'],
  })
  .refine((data) => !data.changeNote || Boolean(data.updated), {
    message: 'changeNote requires an updated date',
    path: ['changeNote'],
  });

export type Frontmatter = z.infer<typeof FrontmatterSchema>;

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  /** Last substantive update, if any. */
  updated?: string;
  excerpt: string;
  tags: string[];
  cover?: string;
  type: ArticleType;
  readingMinutes: number;
  readingLabel: string;
}

export interface Post extends PostMeta {
  seoTitle?: string;
  author?: string;
  cluster?: string;
  sources: ArticleSource[];
  faq: FaqItem[];
  entities: ArticleEntity[];
  aiAssisted: boolean;
  changeNote?: string;
  /** Raw MDX body (frontmatter stripped). */
  content: string;
}

interface RawPost extends Post {
  draft: boolean;
}

function listContentFiles(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'));
}

function parseFile(fileName: string): RawPost {
  const fullPath = path.join(CONTENT_DIR, fileName);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = parseFrontmatter(raw);

  const parsed = FrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n');
    throw new Error(
      `Invalid frontmatter in content/straipsniai/${fileName}:\n${issues}`,
    );
  }

  const frontmatter = parsed.data;
  const stats = readingTime(content);
  const minutes = Math.max(1, Math.ceil(stats.minutes));

  return {
    slug: frontmatter.slug,
    title: frontmatter.title,
    date: frontmatter.date,
    updated: frontmatter.updated,
    excerpt: frontmatter.excerpt,
    tags: frontmatter.tags,
    cover: frontmatter.cover,
    type: frontmatter.type,
    draft: frontmatter.draft,
    seoTitle: frontmatter.seoTitle,
    author: frontmatter.author,
    cluster: frontmatter.cluster,
    sources: frontmatter.sources,
    faq: frontmatter.faq,
    entities: frontmatter.entities,
    aiAssisted: frontmatter.aiAssisted,
    changeNote: frontmatter.changeNote,
    readingMinutes: minutes,
    readingLabel: readingLabelLt(minutes),
    content,
  };
}

function stripDraft(post: RawPost): Post {
  const { draft: _draft, ...rest } = post;
  void _draft;
  return rest;
}

function toMeta(post: RawPost): PostMeta {
  return {
    slug: post.slug,
    title: post.title,
    date: post.date,
    updated: post.updated,
    excerpt: post.excerpt,
    tags: post.tags,
    cover: post.cover,
    type: post.type,
    readingMinutes: post.readingMinutes,
    readingLabel: post.readingLabel,
  };
}

/** Date of the last substantive change: `updated` when set, else `date`. */
export function lastModified(post: Pick<PostMeta, 'date' | 'updated'>): string {
  return post.updated ?? post.date;
}

/**
 * Reads every post, validates frontmatter, drops drafts in production, and
 * sorts newest-first. Throws on malformed frontmatter or duplicate slugs.
 */
function getAllRawPosts(): RawPost[] {
  const posts = listContentFiles().map(parseFile);
  const isProduction = process.env.NODE_ENV === 'production';
  const visible = isProduction ? posts.filter((post) => !post.draft) : posts;

  const seen = new Set<string>();
  for (const post of visible) {
    if (seen.has(post.slug)) {
      throw new Error(
        `Duplicate slug "${post.slug}" found in content/straipsniai. Slugs must be unique.`,
      );
    }
    seen.add(post.slug);
  }

  return visible.sort((a, b) => b.date.localeCompare(a.date));
}

export function getAllPosts(): Post[] {
  return getAllRawPosts().map(stripDraft);
}

export function getAllPostsMeta(): PostMeta[] {
  return getAllRawPosts().map(toMeta);
}

export function getPostBySlug(slug: string): Post | undefined {
  const post = getAllRawPosts().find((entry) => entry.slug === slug);
  return post ? stripDraft(post) : undefined;
}

export function getAllSlugs(): string[] {
  return getAllRawPosts().map((post) => post.slug);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const post of getAllRawPosts()) {
    post.tags.forEach((tag) => tags.add(tag));
  }
  return [...tags].sort((a, b) => a.localeCompare(b, 'lt'));
}

/**
 * Adjacent posts for prev/next navigation. Posts are newest-first, so the
 * chronologically newer post sits at a lower index.
 */
export function getAdjacentPosts(slug: string): {
  prev?: PostMeta;
  next?: PostMeta;
} {
  const all = getAllPostsMeta();
  const index = all.findIndex((post) => post.slug === slug);
  if (index === -1) return {};

  return {
    next: index > 0 ? all[index - 1] : undefined,
    prev: index < all.length - 1 ? all[index + 1] : undefined,
  };
}
