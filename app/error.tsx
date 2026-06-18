'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { IconArrowRight, IconSpark } from '@/components/icons';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO: report to your error tracking service (e.g. Sentry).
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-content flex-col items-center justify-center px-5 py-20 text-center sm:px-8">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-accent text-accent-fg">
        <IconSpark size={34} />
      </span>

      <h1 className="mt-8 font-serif text-3xl sm:text-4xl">Kažkas nutiko</h1>
      <p className="mt-4 max-w-md text-muted">
        Įvyko nenumatyta klaida. Pabandyk dar kartą — jei kartojasi, grįžk į
        pradžią ir užsuk vėliau.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => reset()} className="btn-accent">
          Bandyti dar kartą
          <IconArrowRight size={18} />
        </button>
        <Link href="/" className="btn-outline">
          Grįžti į pradžią
        </Link>
      </div>
    </div>
  );
}
