import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypePrettyCode from 'rehype-pretty-code';
import type { Options as PrettyCodeOptions } from 'rehype-pretty-code';
import rehypeStringify from 'rehype-stringify';

const CALLOUT_LABELS: Record<string, string> = {
  info: 'Pastaba',
  tip: 'Patarimas',
  warning: 'Atkreipk dėmesį',
  sample: 'Pavyzdys',
};

const prettyCodeOptions: PrettyCodeOptions = {
  theme: {
    light: 'github-light-high-contrast',
    dark: 'github-dark-high-contrast',
  },
  keepBackground: false,
};

function readAttr(attrs: string, name: string): string {
  const match = attrs.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`));
  return match ? match[1] : '';
}

/**
 * Approximates our MDX components as plain Markdown so the editor preview can
 * render without evaluating JSX (Next forbids react-dom/server in the app
 * router). The published page uses the real components at build time.
 */
function toMarkdown(body: string): string {
  let out = body;

  out = out.replace(/<ProseImage\b([^>]*?)\/>/g, (_match, attrs: string) => {
    const src = readAttr(attrs, 'src');
    const alt = readAttr(attrs, 'alt');
    const caption = readAttr(attrs, 'caption');
    return `![${alt}](${src})${caption ? `\n\n*${caption}*` : ''}`;
  });

  out = out.replace(
    /<Callout\b([^>]*)>([\s\S]*?)<\/Callout>/g,
    (_match, attrs: string, inner: string) => {
      const label =
        readAttr(attrs, 'title') ||
        CALLOUT_LABELS[readAttr(attrs, 'type')] ||
        'Pastaba';
      const quoted = inner
        .trim()
        .split('\n')
        .map((line) => (line.trim() ? `> ${line}` : '>'))
        .join('\n');
      return `> **${label}**\n>\n${quoted}`;
    },
  );

  return out;
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypePrettyCode, prettyCodeOptions)
  .use(rehypeStringify);

export async function renderPreviewHtml(body: string): Promise<string> {
  const markdown = toMarkdown(
    body.trim() || '*Pradėk rašyti, kad pamatytum peržiūrą…*',
  );
  const file = await processor.process(markdown);
  return String(file);
}
