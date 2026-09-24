import { getAllPostsMeta, lastModified } from '@/lib/posts';
import { siteConfig } from '@/lib/site';

export const dynamic = 'force-static';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** RFC 822 date for RSS, pinned to midnight UTC of the ISO date. */
function rssDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toUTCString();
}

export function GET() {
  const posts = getAllPostsMeta();
  const channelUrl = `${siteConfig.url}/straipsniai`;
  const lastBuild = posts
    .map((post) => lastModified(post))
    .sort()
    .at(-1);

  const items = posts
    .map((post) => {
      const url = `${siteConfig.url}/straipsniai/${post.slug}`;
      const categories = post.tags
        .map((tag) => `      <category>${escapeXml(tag)}</category>`)
        .join('\n');
      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${rssDate(post.date)}</pubDate>`,
        `      <description>${escapeXml(post.excerpt)}</description>`,
        categories,
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${siteConfig.name} — straipsniai`)}</title>
    <link>${channelUrl}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>lt</language>
${lastBuild ? `    <lastBuildDate>${rssDate(lastBuild)}</lastBuildDate>\n` : ''}    <atom:link href="${channelUrl}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
