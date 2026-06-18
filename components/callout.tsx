import type { ReactNode } from 'react';

type CalloutType = 'info' | 'tip' | 'warning' | 'sample';

interface CalloutStyle {
  container: string;
  badge: string;
  label: string;
}

const STYLES: Record<CalloutType, CalloutStyle> = {
  info: {
    container: 'border-accent/30 bg-accent/5',
    badge: 'bg-accent/15 text-accent',
    label: 'Pastaba',
  },
  tip: {
    container: 'border-accent/40 bg-accent/10',
    badge: 'bg-accent text-accent-fg',
    label: 'Patarimas',
  },
  warning: {
    container: 'border-amber-400/40 bg-amber-400/10',
    badge: 'bg-amber-400/25 text-amber-800 dark:text-amber-200',
    label: 'Atkreipk dėmesį',
  },
  sample: {
    container: 'border-dashed border-line bg-surface/60',
    badge: 'bg-surface text-muted',
    label: 'Pavyzdys',
  },
};

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

/** Callout box for use inside MDX articles. */
export function Callout({ type = 'info', title, children }: CalloutProps) {
  const style = STYLES[type];

  return (
    <div className={`my-6 rounded-2xl border p-5 ${style.container}`}>
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${style.badge}`}
        >
          {title ?? style.label}
        </span>
      </div>
      <div className="text-sm leading-relaxed text-ink [&>p]:m-0 [&>p+p]:mt-3">
        {children}
      </div>
    </div>
  );
}
