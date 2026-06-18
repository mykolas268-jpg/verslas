import fs from 'node:fs';
import path from 'node:path';
import readingTime from 'reading-time';
import { z } from 'zod';
import { parseFrontmatter } from './frontmatter';
import { readingLabelLt } from './format';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'straipsniai');

/**
 * Frontmatter contract. Invalid frontmatter throws and fails the build loudly,
 * which is the intended behavior (no silently-broken posts in production).
 */
export const FrontmatterSchema = z.object({
  title: z.string().min(1, 'title is required'),
  slug: z
    .string()
    .min(1, 'slug is required')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'slug must be lowercase ascii kebab-case (e.g. "ai-klientu-aptarnavimas")',
    ),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be in YYYY-MM-DD format'),
  excerpt: z.string().min(1, 'excerpt is required'),
  tags: z.array(z.string()).default([]),
  cover: z.string().optional(),
  draft: z.boolean().default(false),
});

export type Frontmatter = z.infer<typeof FrontmatterSchema>;

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  cover?: string;
  readingMinutes: number;
  readingLabel: string;
}

export interface Post extends PostMeta {
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
    excerpt: frontmatter.excerpt,
    tags: frontmatter.tags,
    cover: frontmatter.cover,
    draft: frontmatter.draft,
    readingMinutes: minutes,
    readingLabel: readingLabelLt(minutes),
    content,
  };
}

function stripDraft(post: RawPost): Post {
  return {
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    tags: post.tags,
    cover: post.cover,
    readingMinutes: post.readingMinutes,
    readingLabel: post.readingLabel,
    content: post.content,
  };
}

function toMeta(post: RawPost): PostMeta {
  return {
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    tags: post.tags,
    cover: post.cover,
    readingMinutes: post.readingMinutes,
    readingLabel: post.readingLabel,
  };
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
