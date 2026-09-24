/**
 * Article authors, keyed by the `author` frontmatter field.
 *
 * Only publish details the author has provided. `url` points at the author's
 * profile page on this site; leave it unset until that page exists.
 */

export interface Author {
  id: string;
  name: string;
  /** Site-relative profile path, e.g. "/apie/mykolas-gustas". */
  url?: string;
  jobTitle?: string;
  /** Profile links (LinkedIn etc.) for JSON-LD `sameAs`. */
  sameAs: string[];
}

export const authors: Record<string, Author> = {
  'mykolas-gustas': {
    id: 'mykolas-gustas',
    name: 'Mykolas Gustas',
    sameAs: [],
  },
};

export function getAuthor(id: string | undefined): Author | undefined {
  if (!id) return undefined;
  const author = authors[id];
  if (!author) {
    throw new Error(
      `Unknown author "${id}". Add it to lib/authors.ts or fix the frontmatter.`,
    );
  }
  return author;
}
