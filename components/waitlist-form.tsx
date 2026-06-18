'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { IconArrowRight, IconCheck } from './icons';

type Status = 'idle' | 'error' | 'success';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Waitlist / newsletter capture. The submit handler is intentionally a
 * placeholder — the UI is final, only the integration point is pending.
 */
export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();

    if (!EMAIL_RE.test(trimmed)) {
      setStatus('error');
      return;
    }

    // TODO: connect backend — POST `trimmed` to a real waitlist/newsletter
    // provider (an API route + Resend / ConvertKit / Mailchimp, etc.).
    setStatus('success');
    setEmail('');
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        className="flex items-center gap-3 rounded-2xl border border-accent/40 bg-accent/10 px-5 py-4 text-sm text-ink"
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-accent-fg">
          <IconCheck size={18} />
        </span>
        <span>Ačiū! Pranešime tau, kai tik startuosim.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="waitlist-email" className="sr-only">
            El. pašto adresas
          </label>
          <input
            id="waitlist-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (status === 'error') setStatus('idle');
            }}
            aria-invalid={status === 'error'}
            aria-describedby={status === 'error' ? 'waitlist-error' : undefined}
            placeholder="vardas@imone.lt"
            className="field"
          />
        </div>
        <button type="submit" className="btn-accent shrink-0">
          Užsiprenumeruoti
          <IconArrowRight size={18} />
        </button>
      </div>
      {status === 'error' ? (
        <p id="waitlist-error" role="alert" className="mt-2 px-1 text-sm text-accent">
          Įvesk teisingą el. pašto adresą.
        </p>
      ) : null}
    </form>
  );
}
