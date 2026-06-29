import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { ReactElement } from 'react';

const FONT_DIR = path.join(process.cwd(), 'assets', 'fonts');

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

/**
 * Inter (latin + latin-ext) as woff buffers. Passing both subsets lets Satori
 * fall back across them so Lithuanian diacritics render correctly.
 */
export async function loadOgFonts() {
  try {
    const [latin, latinExt] = await Promise.all([
      readFile(path.join(FONT_DIR, 'inter-latin-600.woff')),
      readFile(path.join(FONT_DIR, 'inter-latin-ext-600.woff')),
    ]);

    return [
      { name: 'Inter', data: latin, weight: 600 as const, style: 'normal' as const },
      { name: 'Inter', data: latinExt, weight: 600 as const, style: 'normal' as const },
    ];
  } catch {
    // If the font files can't be read at runtime, fall back to ImageResponse's
    // default font rather than failing OG image generation entirely.
    return [];
  }
}

/** Shared Open Graph card layout (Satori-compatible inline styles only). */
export function OgFrame({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}): ReactElement {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
        backgroundColor: '#0a2f3a',
        backgroundImage: 'linear-gradient(135deg, #0c655a, #0a2f3a)',
        color: '#ffffff',
        fontFamily: 'Inter',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            backgroundColor: '#2dd4bf',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 22,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 5,
              backgroundColor: '#0a2f3a',
            }}
          />
        </div>
        <div style={{ display: 'flex', fontSize: 36, fontWeight: 600 }}>
          <span>verslas</span>
          <span style={{ color: '#7ee7d6' }}>.ai</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontSize: 24,
            letterSpacing: 4,
            color: '#7ee7d6',
            marginBottom: 22,
          }}
        >
          {eyebrow}
        </div>
        <div style={{ fontSize: 62, lineHeight: 1.12, fontWeight: 700, maxWidth: 1010 }}>
          {title}
        </div>
      </div>

      <div style={{ fontSize: 24, color: '#bdeee8' }}>verslas.ai</div>
    </div>
  );
}
