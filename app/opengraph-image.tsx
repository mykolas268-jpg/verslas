import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/site';
import { OgFrame, loadOgFonts, ogContentType, ogSize } from '@/lib/og';

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = ogSize;
export const contentType = ogContentType;

export default async function OpengraphImage() {
  const fonts = await loadOgFonts();

  return new ImageResponse(
    <OgFrame eyebrow="DIRBTINIS INTELEKTAS VERSLE" title={siteConfig.tagline} />,
    { ...size, fonts },
  );
}
