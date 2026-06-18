import Link from 'next/link';

interface TagProps {
  label: string;
  /** When provided, the tag renders as a link (e.g. to a filtered list). */
  href?: string;
  active?: boolean;
}

const baseClasses =
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors';

export function Tag({ label, href, active = false }: TagProps) {
  const classes = `${baseClasses} ${
    active
      ? 'border-accent bg-accent text-accent-fg'
      : 'border-line bg-surface text-muted'
  } ${href ? 'hover:border-accent hover:text-ink' : ''}`.trim();

  if (href) {
    return (
      <Link href={href} className={classes}>
        {label}
      </Link>
    );
  }

  return <span className={classes}>{label}</span>;
}
