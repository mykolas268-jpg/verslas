import { test, expect } from '@playwright/test';

const ARTICLE_SLUG = 'reklaminis-video-kaina';

type JsonLdNode = Record<string, unknown> & { '@type'?: string };

async function jsonLdGraph(html: string): Promise<JsonLdNode[]> {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  return blocks.flatMap((match) => {
    const data = JSON.parse(match[1]) as JsonLdNode & { '@graph'?: JsonLdNode[] };
    return data['@graph'] ?? [data];
  });
}

test.describe('technical SEO', () => {
  test('robots.txt allows search and answer bots and blocks private paths', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);
    const body = await response.text();
    for (const bot of ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'PerplexityBot', 'Claude-SearchBot']) {
      expect(body).toContain(`User-Agent: ${bot}`);
    }
    expect(body).toContain('Disallow: /admin');
    expect(body).toContain('Sitemap: https://verslas.ai/sitemap.xml');
  });

  test('sitemap lists every article with lastmod', async ({ request }) => {
    const body = await (await request.get('/sitemap.xml')).text();
    const articleEntries = body.match(/<url>\s*<loc>[^<]*\/straipsniai\/[^<]+<\/loc>[\s\S]*?<\/url>/g) ?? [];
    expect(articleEntries.length).toBeGreaterThan(0);
    for (const entry of articleEntries) {
      expect(entry).toContain('<lastmod>');
    }
  });

  test('RSS feed is valid-looking and lists articles', async ({ request }) => {
    const response = await request.get('/straipsniai/rss.xml');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/rss+xml');
    const body = await response.text();
    expect(body).toContain('<rss version="2.0"');
    expect(body).toContain(`/straipsniai/${ARTICLE_SLUG}</link>`);
  });

  test('llms.txt lists the service and articles', async ({ request }) => {
    const response = await request.get('/llms.txt');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body.startsWith('# verslas.ai')).toBe(true);
    expect(body).toContain('/reklaminis-video');
    expect(body).toContain(`/straipsniai/${ARTICLE_SLUG}`);
  });

  test('publisher logo is a PNG', async ({ request }) => {
    const response = await request.get('/logo.png');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
  });

  test('article JSON-LD has article, breadcrumbs and publisher logo', async ({ request }) => {
    const html = await (await request.get(`/straipsniai/${ARTICLE_SLUG}`)).text();
    const graph = await jsonLdGraph(html);

    const article = graph.find((node) => node['@type'] === 'BlogPosting' || node['@type'] === 'NewsArticle');
    expect(article).toBeTruthy();
    expect(article?.inLanguage).toBe('lt-LT');
    expect(article?.dateModified).toBeTruthy();
    const publisher = article?.publisher as { logo?: { url?: string } };
    expect(publisher.logo?.url).toBe('https://verslas.ai/logo.png');

    const breadcrumbs = graph.find((node) => node['@type'] === 'BreadcrumbList') as
      | { itemListElement: unknown[] }
      | undefined;
    expect(breadcrumbs?.itemListElement).toHaveLength(3);
  });

  test('home page declares Organization and WebSite', async ({ request }) => {
    const graph = await jsonLdGraph(await (await request.get('/')).text());
    const types = graph.map((node) => node['@type']);
    expect(types).toContain('Organization');
    expect(types).toContain('WebSite');
  });

  test('article <title> stays within 60 characters or drops the site suffix', async ({ request }) => {
    const html = await (await request.get(`/straipsniai/${ARTICLE_SLUG}`)).text();
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
    expect(title.length <= 60 || !title.endsWith(' · verslas.ai')).toBe(true);
  });
});
