import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';
import type { Options as PrettyCodeOptions } from 'rehype-pretty-code';
import type { PluggableList } from 'unified';
import { mdxComponents } from './mdx-components';

const prettyCodeOptions: PrettyCodeOptions = {
  // Dual theme; token colors are wired to .dark in globals.css.
  // High-contrast variants so syntax tokens meet WCAG AA (4.5:1) contrast.
  theme: { light: 'github-light-high-contrast', dark: 'github-dark-high-contrast' },
  keepBackground: false,
};

const rehypePlugins: PluggableList = [[rehypePrettyCode, prettyCodeOptions]];

/**
 * Compiles and renders an MDX string at build time (SSG). Syntax highlighting
 * runs here, so highlighted code ships as static HTML with zero client JS.
 */
export async function MdxContent({ source }: { source: string }) {
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins,
      },
    },
  });

  return content;
}
