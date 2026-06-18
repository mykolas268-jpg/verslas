import type { PostMeta } from './posts';

/**
 * Pure client-side filter over the pre-generated post index.
 * Matches the query (case-insensitive substring) against title, excerpt and
 * tags, and narrows by an optional active tag. Kept pure so it is trivial to
 * unit-test and reuse.
 */
export function filterPosts(
  posts: PostMeta[],
  query: string,
  activeTag: string | null,
): PostMeta[] {
  const normalizedQuery = query.trim().toLowerCase();

  return posts.filter((post) => {
    if (activeTag && !post.tags.includes(activeTag)) {
      return false;
    }
    if (!normalizedQuery) {
      return true;
    }
    const haystack = [post.title, post.excerpt, ...post.tags]
      .join(' ')
      .toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}
