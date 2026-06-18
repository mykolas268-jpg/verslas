import { dump } from 'js-yaml';
import { z } from 'zod';
import { compile } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import { parseFrontmatter } from '@/lib/frontmatter';
import { FrontmatterSchema } from '@/lib/posts';
import { getStorage } from './storage';
import { slugify } from './slug';

export interface AdminPostSummary {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  draft: boolean;
  valid: boolean;
}

export interface AdminPostDraft {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  tags: string[];
  cover: string;
  draft: boolean;
  body: string;
}

/** Validates editor input before it is assembled into a post. */
export const PostInputSchema = z.object({
  title: z.string().trim().min(1, 'Antraštė privaloma'),
  slug: z.string().trim().optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data turi būti YYYY-MM-DD formatu'),
  excerpt: z.string().trim().min(1, 'Santrauka privaloma'),
  tags: z.array(z.string().trim().min(1)).default([]),
  cover: z.string().trim().optional().default(''),
  draft: z.boolean().default(false),
  body: z.string().min(1, 'Turinys negali būti tuščias'),
});

export type PostInput = z.infer<typeof PostInputSchema>;

const COMMITTER = 'verslas.ai admin';

function buildMdx(input: PostInput, slug: string): string {
  const frontmatter: Record<string, unknown> = {
    title: input.title.trim(),
    slug,
    date: input.date,
    excerpt: input.excerpt.trim(),
    tags: input.tags,
  };
  if (input.cover && input.cover.trim()) {
    frontmatter.cover = input.cover.trim();
  }
  frontmatter.draft = input.draft;

  const yaml = dump(frontmatter, { lineWidth: -1, noRefs: true });
  return `---\n${yaml}---\n\n${input.body.trim()}\n`;
}

export async function listPosts(): Promise<AdminPostSummary[]> {
  const storage = getStorage();
  const slugs = await storage.listSlugs();

  const summaries: AdminPostSummary[] = [];
  for (const slug of slugs) {
    const file = await storage.read(slug);
    if (!file) continue;
    const { data } = parseFrontmatter(file.content);
    const parsed = FrontmatterSchema.safeParse(data);
    if (parsed.success) {
      summaries.push({
        slug: parsed.data.slug,
        title: parsed.data.title,
        date: parsed.data.date,
        excerpt: parsed.data.excerpt,
        tags: parsed.data.tags,
        draft: parsed.data.draft,
        valid: true,
      });
    } else {
      summaries.push({
        slug,
        title: typeof data.title === 'string' ? data.title : slug,
        date: typeof data.date === 'string' ? data.date : '',
        excerpt: '',
        tags: [],
        draft: true,
        valid: false,
      });
    }
  }

  return summaries.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPostDraft(slug: string): Promise<AdminPostDraft | null> {
  const storage = getStorage();
  const file = await storage.read(slug);
  if (!file) return null;

  const { data, content } = parseFrontmatter(file.content);
  const asString = (value: unknown, fallback = '') =>
    typeof value === 'string' ? value : fallback;

  return {
    title: asString(data.title),
    slug: asString(data.slug, slug),
    date: asString(data.date),
    excerpt: asString(data.excerpt),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    cover: asString(data.cover),
    draft: data.draft === true,
    body: content.trim(),
  };
}

export interface SaveResult {
  slug: string;
  storage: 'github' | 'file';
}

/**
 * Validates and persists a post. Throws on validation errors or on a slug
 * collision when creating a new post.
 */
export async function savePost(
  input: PostInput,
  mode: 'create' | 'update',
): Promise<SaveResult> {
  const storage = getStorage();
  const slug = slugify(input.slug?.trim() || input.title);
  if (!slug) {
    throw new Error('Nepavyko sugeneruoti nuorodos (slug) iš antraštės.');
  }

  // Final guard: the assembled frontmatter must satisfy the build-time schema.
  const frontmatterCheck = FrontmatterSchema.safeParse({
    title: input.title,
    slug,
    date: input.date,
    excerpt: input.excerpt,
    tags: input.tags,
    cover: input.cover || undefined,
    draft: input.draft,
  });
  if (!frontmatterCheck.success) {
    throw new Error(
      frontmatterCheck.error.issues.map((issue) => issue.message).join('; '),
    );
  }

  // Validate that the body compiles as MDX so a broken post can never be
  // published (the production build would otherwise fail on it).
  try {
    await compile(input.body, { remarkPlugins: [remarkGfm] });
  } catch (error) {
    throw new Error(
      `MDX sintaksės klaida turinyje: ${
        error instanceof Error ? error.message : 'patikrink turinį'
      }`,
    );
  }

  if (mode === 'create') {
    const existing = await storage.read(slug);
    if (existing) {
      throw new Error(`Straipsnis su nuoroda „${slug}" jau egzistuoja.`);
    }
  }

  const verb = input.draft ? 'save draft' : 'publish';
  const message = `content(${COMMITTER}): ${verb} ${slug}`;
  await storage.write(slug, buildMdx({ ...input, slug }, slug), message);

  return { slug, storage: storage.kind };
}

export async function deletePost(slug: string): Promise<void> {
  const storage = getStorage();
  await storage.remove(slug, `content(${COMMITTER}): delete ${slug}`);
}
