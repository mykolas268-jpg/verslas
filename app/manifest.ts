import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: 'verslas.ai',
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    lang: siteConfig.lang,
    background_color: '#fbfaf8',
    theme_color: '#0d6e63',
    icons: [
      {
        src: '/icon.svg',
        type: 'image/svg+xml',
        sizes: 'any',
        purpose: 'any',
      },
    ],
  };
}
