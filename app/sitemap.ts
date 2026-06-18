import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';
import { getAllPostsMeta } from '@/lib/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/straipsniai`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/kursai`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/apie`, changeFrequency: 'yearly', priority: 0.5 },
  ];

  const postRoutes: MetadataRoute.Sitemap = getAllPostsMeta().map((post) => ({
    url: `${base}/straipsniai/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...postRoutes];
}
