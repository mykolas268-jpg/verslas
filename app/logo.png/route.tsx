import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';

const SIZE = 512;

/**
 * Square raster version of app/icon.svg for the JSON-LD publisher logo
 * (Google wants a crawlable image of at least 112×112 px).
 */
export async function GET() {
  const svg = await readFile(path.join(process.cwd(), 'app', 'icon.svg'));
  const src = `data:image/svg+xml;base64,${svg.toString('base64')}`;

  return new ImageResponse(
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img src={src} width={SIZE} height={SIZE} />,
    { width: SIZE, height: SIZE },
  );
}
