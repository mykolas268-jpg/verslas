import Link from 'next/link';
import { IconArrowRight, IconSpark } from '@/components/icons';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-content flex-col items-center justify-center px-5 py-20 text-center sm:px-8">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-accent text-accent-fg">
        <IconSpark size={34} />
      </span>

      <p className="mt-8 font-serif text-6xl text-accent sm:text-7xl">404</p>
      <h1 className="mt-4 font-serif text-3xl sm:text-4xl">
        Šis puslapis pasiklydo
      </h1>
      <p className="mt-4 max-w-md text-muted">
        Puslapio, kurio ieškai, nėra arba jis buvo perkeltas. Bet nepasiklysk —
        grįžk į pradžią arba paskaityk ką nors naujo.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-accent">
          Grįžti į pradžią
          <IconArrowRight size={18} />
        </Link>
        <Link href="/straipsniai" className="btn-outline">
          Skaityti straipsnius
        </Link>
      </div>
    </div>
  );
}
