import fs from 'node:fs/promises';
import path from 'node:path';
import {
  CONTENT_SUBDIR,
  IMAGES_SUBDIR,
  githubConfig,
  type GithubConfig,
} from './config';

export interface StoredFile {
  content: string;
  sha?: string;
}

/**
 * Abstracts where posts live. Local filesystem for `npm run dev` authoring;
 * the GitHub Contents API in production (commits trigger a Vercel rebuild).
 */
export interface PostStorage {
  kind: 'github' | 'file';
  listSlugs(): Promise<string[]>;
  read(slug: string): Promise<StoredFile | null>;
  write(slug: string, content: string, message: string): Promise<void>;
  remove(slug: string, message: string): Promise<void>;
  writeImage(name: string, data: Buffer, message: string): Promise<string>;
}

class FileStorage implements PostStorage {
  kind = 'file' as const;

  private contentDir = path.join(process.cwd(), CONTENT_SUBDIR);
  private imagesDir = path.join(process.cwd(), IMAGES_SUBDIR);

  async listSlugs(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.contentDir);
      return files
        .filter((file) => file.endsWith('.mdx'))
        .map((file) => file.replace(/\.mdx$/, ''));
    } catch {
      return [];
    }
  }

  async read(slug: string): Promise<StoredFile | null> {
    try {
      const content = await fs.readFile(
        path.join(this.contentDir, `${slug}.mdx`),
        'utf8',
      );
      return { content };
    } catch {
      return null;
    }
  }

  async write(slug: string, content: string): Promise<void> {
    await fs.mkdir(this.contentDir, { recursive: true });
    await fs.writeFile(path.join(this.contentDir, `${slug}.mdx`), content, 'utf8');
  }

  async remove(slug: string): Promise<void> {
    await fs.rm(path.join(this.contentDir, `${slug}.mdx`), { force: true });
  }

  async writeImage(name: string, data: Buffer): Promise<string> {
    await fs.mkdir(this.imagesDir, { recursive: true });
    await fs.writeFile(path.join(this.imagesDir, name), data);
    return `/images/${name}`;
  }
}

class GithubStorage implements PostStorage {
  kind = 'github' as const;

  constructor(private cfg: GithubConfig) {}

  private url(filePath: string): string {
    return `https://api.github.com/repos/${this.cfg.repo}/contents/${filePath}`;
  }

  private headers(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.cfg.token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
  }

  private async shaOf(filePath: string): Promise<string | undefined> {
    const res = await fetch(`${this.url(filePath)}?ref=${this.cfg.branch}`, {
      headers: this.headers(),
      cache: 'no-store',
    });
    if (res.status === 404) return undefined;
    if (!res.ok) throw new Error(`GitHub request failed (${res.status}).`);
    const data = (await res.json()) as { sha?: string };
    return data.sha;
  }

  async listSlugs(): Promise<string[]> {
    const res = await fetch(`${this.url(CONTENT_SUBDIR)}?ref=${this.cfg.branch}`, {
      headers: this.headers(),
      cache: 'no-store',
    });
    if (res.status === 404) return [];
    if (!res.ok) throw new Error(`GitHub list failed (${res.status}).`);
    const entries = (await res.json()) as Array<{ type: string; name: string }>;
    return entries
      .filter((entry) => entry.type === 'file' && entry.name.endsWith('.mdx'))
      .map((entry) => entry.name.replace(/\.mdx$/, ''));
  }

  async read(slug: string): Promise<StoredFile | null> {
    const res = await fetch(
      `${this.url(`${CONTENT_SUBDIR}/${slug}.mdx`)}?ref=${this.cfg.branch}`,
      { headers: this.headers(), cache: 'no-store' },
    );
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`GitHub read failed (${res.status}).`);
    const data = (await res.json()) as { content: string; sha: string };
    return {
      content: Buffer.from(data.content, 'base64').toString('utf8'),
      sha: data.sha,
    };
  }

  private async put(
    filePath: string,
    base64: string,
    message: string,
  ): Promise<void> {
    const sha = await this.shaOf(filePath);
    const res = await fetch(this.url(filePath), {
      method: 'PUT',
      headers: { ...this.headers(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        content: base64,
        branch: this.cfg.branch,
        sha,
      }),
    });
    if (!res.ok) {
      throw new Error(`GitHub write failed (${res.status}): ${await res.text()}`);
    }
  }

  async write(slug: string, content: string, message: string): Promise<void> {
    await this.put(
      `${CONTENT_SUBDIR}/${slug}.mdx`,
      Buffer.from(content, 'utf8').toString('base64'),
      message,
    );
  }

  async remove(slug: string, message: string): Promise<void> {
    const filePath = `${CONTENT_SUBDIR}/${slug}.mdx`;
    const sha = await this.shaOf(filePath);
    if (!sha) return;
    const res = await fetch(this.url(filePath), {
      method: 'DELETE',
      headers: { ...this.headers(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sha, branch: this.cfg.branch }),
    });
    if (!res.ok) throw new Error(`GitHub delete failed (${res.status}).`);
  }

  async writeImage(name: string, data: Buffer, message: string): Promise<string> {
    await this.put(`${IMAGES_SUBDIR}/${name}`, data.toString('base64'), message);
    return `/images/${name}`;
  }
}

export function getStorage(): PostStorage {
  const cfg = githubConfig();
  return cfg ? new GithubStorage(cfg) : new FileStorage();
}
