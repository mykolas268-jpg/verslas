/** Admin/runtime configuration read from environment variables. */

export const CONTENT_SUBDIR = 'content/straipsniai';
export const IMAGES_SUBDIR = 'public/images';

export interface GithubConfig {
  token: string;
  repo: string; // "owner/name"
  branch: string;
}

/**
 * Returns GitHub config when both a token and repo are set, otherwise null
 * (in which case the admin falls back to local-filesystem storage — useful for
 * local authoring with `npm run dev`).
 */
export function githubConfig(): GithubConfig | null {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  if (token && repo) {
    return { token, repo, branch };
  }
  return null;
}

/** SESSION_SECRET must be at least this long to sign session cookies. */
export const MIN_SESSION_SECRET_LENGTH = 16;

export function isAdminConfigured(): boolean {
  const secret = process.env.SESSION_SECRET;
  return Boolean(
    process.env.ADMIN_PASSWORD &&
      secret &&
      secret.length >= MIN_SESSION_SECRET_LENGTH,
  );
}
