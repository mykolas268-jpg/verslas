'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { siteConfig } from '@/lib/site';
import { IconClose, IconMenu, IconSpark } from './icons';
import { ThemeToggle } from './theme-toggle';

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Wordmark() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2 rounded-md text-lg font-semibold tracking-tight text-ink"
      aria-label={`${siteConfig.name} — pradžia`}
    >
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-fg transition-transform duration-300 ease-out-expo group-hover:rotate-[18deg]">
        <IconSpark size={18} />
      </span>
      <span>
        verslas<span className="text-accent">.ai</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // The admin area has its own chrome.
  if (pathname.startsWith('/admin')) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-4 px-5 sm:px-8">
        <Wordmark />

        <nav
          aria-label="Pagrindinė navigacija"
          className="hidden items-center gap-1 md:flex"
        >
          {siteConfig.nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`relative rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? 'text-ink'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {item.label}
                {active ? (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-accent" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Uždaryti meniu' : 'Atidaryti meniu'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-card text-ink transition-colors hover:bg-surface md:hidden"
          >
            {open ? <IconClose size={18} /> : <IconMenu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-line bg-bg md:hidden"
      >
        <nav aria-label="Mobili navigacija" className="mx-auto max-w-content px-5 py-3 sm:px-8">
          <ul className="flex flex-col">
            {siteConfig.nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`block rounded-lg px-3 py-3 text-base transition-colors ${
                      active ? 'bg-surface text-ink' : 'text-muted hover:bg-surface hover:text-ink'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
