import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';
import { getAllPostsMeta, lastModified } from '@/lib/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const posts = getAllPostsMeta();

  // The index changes whenever any article is published or updated.
  const newestChange = posts
    .map((post) => lastModified(post))
    .sort()
    .at(-1);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/reklaminis-video`, changeFrequency: 'monthly', priority: 0.95 },
    {
      url: `${base}/straipsniai`,
      ...(newestChange ? { lastModified: new Date(newestChange) } : {}),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    { url: `${base}/kursai`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/apie`, changeFrequency: 'yearly', priority: 0.5 },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/straipsniai/${post.slug}`,
    lastModified: new Date(lastModified(post)),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...postRoutes];
}
