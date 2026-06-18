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

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.SESSION_SECRET);
}
