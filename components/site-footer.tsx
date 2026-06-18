import Link from 'next/link';
import { siteConfig } from '@/lib/site';
import { IconSpark } from './icons';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line bg-surface/60">
      <div className="mx-auto max-w-content px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-fg">
                <IconSpark size={18} />
              </span>
              <span>
                verslas<span className="text-accent">.ai</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {siteConfig.description}
            </p>
          </div>

          <nav aria-label="Poraštės navigacija">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
              Naršyti
            </h2>
            <ul className="mt-4 space-y-2">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. Visos teisės saugomos.
          </p>
          <p>Sukurta su dirbtinio intelekto pagalba 🇱🇹</p>
        </div>
      </div>
    </footer>
  );
}
