import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/admin/auth';
import { isAdminConfigured } from '@/lib/admin/config';
import { LoginForm } from '@/components/admin/login-form';
import { IconSpark } from '@/components/icons';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  if (await isAuthenticated()) {
    redirect('/admin');
  }
  const configured = isAdminConfigured();

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 py-16">
      <div className="text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-fg">
          <IconSpark size={26} />
        </span>
        <h1 className="mt-6 font-serif text-3xl">Administravimas</h1>
        <p className="mt-2 text-sm text-muted">
          Prisijunk, kad galėtum kurti ir redaguoti straipsnius.
        </p>
      </div>

      <div className="mt-8">
        {configured ? (
          <LoginForm />
        ) : (
          <div className="rounded-2xl border border-amber-400/40 bg-amber-400/10 p-4 text-sm text-ink">
            <p className="font-medium">Administravimas dar nesukonfigūruotas.</p>
            <p className="mt-2 text-muted">
              Nustatyk <code className="text-ink">ADMIN_PASSWORD</code> ir{' '}
              <code className="text-ink">SESSION_SECRET</code> (bent 16 simbolių)
              aplinkos kintamuosius (žr.{' '}
              <code className="text-ink">.env.example</code>).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
