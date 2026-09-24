import { getAllPostsMeta } from '@/lib/posts';
import { offer } from '@/lib/offer';
import { siteConfig } from '@/lib/site';

export const dynamic = 'force-static';

/**
 * /llms.txt (llmstxt.org format): a plain-Markdown map of the site for AI
 * assistants. Cheap to maintain; its benefit is unproven, so nothing else
 * depends on it.
 */
export function GET() {
  const base = siteConfig.url;
  const posts = getAllPostsMeta();

  const articleLines = posts
    .map((post) => `- [${post.title}](${base}/straipsniai/${post.slug}): ${post.excerpt}`)
    .join('\n');

  const body = `# ${siteConfig.name}

> ${siteConfig.description}

Svetainė lietuvių kalba. Leidėjas: ${siteConfig.publisher.legalName}.

## Paslaugos

- [Reklaminis video verslui](${base}/reklaminis-video): trumpas (${offer.lengthLabel}) reklaminis video už ${offer.price} ${offer.currency}, paruošiamas per ${offer.deliveryLabel}.

## Straipsniai

${articleLines}

## Kiti puslapiai

- [Visi straipsniai](${base}/straipsniai)
- [Apie](${base}/apie)
- [Kaip rengiame straipsnius](${base}/kaip-rengiame-straipsnius)
- [RSS](${base}/straipsniai/rss.xml)
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
