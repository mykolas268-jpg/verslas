import { ImageResponse } from 'next/og';
import { getAllSlugs, getPostBySlug } from '@/lib/posts';
import { siteConfig } from '@/lib/site';
import { OgFrame, loadOgFonts, ogContentType, ogSize } from '@/lib/og';

export const alt = 'verslas.ai straipsnis';
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function ArticleOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const fonts = await loadOgFonts();

  return new ImageResponse(
    <OgFrame
      eyebrow="STRAIPSNIS"
      title={post?.title ?? siteConfig.tagline}
    />,
    { ...size, fonts },
  );
}
