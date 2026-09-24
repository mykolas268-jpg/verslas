import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

const DISALLOW = ['/admin', '/api'];

/**
 * Search engines and AI answer/search agents. Always allowed: they are how
 * the site shows up in Google, Bing, ChatGPT search, Perplexity and Claude.
 */
const SEARCH_AND_ANSWER_BOTS = [
  'Googlebot',
  'Bingbot',
  'Applebot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'Perplexity-User',
  'Claude-SearchBot',
  'Claude-User',
];

/** AI training crawlers and opt-out tokens; policy set in lib/site.ts. */
const AI_TRAINING_BOTS = [
  'GPTBot',
  'ClaudeBot',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
];

export default function robots(): MetadataRoute.Robots {
  // A crawler obeys only the most specific group that names it, so every
  // group repeats the private paths.
  return {
    rules: [
      { userAgent: SEARCH_AND_ANSWER_BOTS, allow: '/', disallow: DISALLOW },
      siteConfig.allowAiTrainingBots
        ? { userAgent: AI_TRAINING_BOTS, allow: '/', disallow: DISALLOW }
        : { userAgent: AI_TRAINING_BOTS, disallow: '/' },
      { userAgent: '*', allow: '/', disallow: DISALLOW },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
