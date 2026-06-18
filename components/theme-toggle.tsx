'use client';

import { useEffect, useState } from 'react';
import { IconMoon, IconSun } from './icons';

/**
 * Light/dark toggle. The initial theme is applied pre-hydration by the inline
 * boot script in the root layout, so this component only reflects and updates
 * state. Rendering a stable icon until mounted avoids hydration mismatches.
 */
export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      // Ignore storage failures (private mode, blocked cookies).
    }
    setIsDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Perjungti šviesų arba tamsų režimą"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-card text-ink transition-colors hover:bg-surface"
    >
      {mounted && isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
    </button>
  );
}
