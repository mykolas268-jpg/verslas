import type { Metadata } from 'next';
import type { Post } from './posts';
import { siteConfig } from './site';

/** Must match the title template in app/layout.tsx. */
export const TITLE_SUFFIX = ` · ${siteConfig.name}`;

/** Longest <title> (including the suffix) that search results show in full. */
export const MAX_TITLE_LENGTH = 60;

/**
 * <title> for an article: `seoTitle` when set, else `title`. The site suffix is
 * appended only when the result still fits in MAX_TITLE_LENGTH characters.
 */
export function articleTitle(post: Pick<Post, 'title' | 'seoTitle'>): Metadata['title'] {
  const base = post.seoTitle ?? post.title;
  return base.length + TITLE_SUFFIX.length <= MAX_TITLE_LENGTH
    ? base
    : { absolute: base };
}
