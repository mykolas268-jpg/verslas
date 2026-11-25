'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { IconArrowRight, IconCheck } from './icons';

type Status = 'idle' | 'sending' | 'error' | 'success';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Waitlist / newsletter capture. Stores the address via /api/leads
 * (type: 'waitlist') in Supabase.
 */
export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState(''); // honeypot
  const [status, setStatus] = useState<Status>('idle');
  const [errorText, setErrorText] = useState('Įvesk teisingą el. pašto adresą.');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();

    if (!EMAIL_RE.test(trimmed)) {
      setErrorText('Įvesk teisingą el. pašto adresą.');
      setStatus('error');
      return;
    }

    setStatus('sending');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'waitlist',
          email: trimmed,
          sourcePath: window.location.pathname,
          company,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setErrorText(data?.error ?? 'Nepavyko užregistruoti. Pabandyk dar kartą.');
        setStatus('error');
        return;
      }

      setStatus('success');
      setEmail('');
    } catch {
      setErrorText('Nepavyko užregistruoti - patikrink ryšį ir pabandyk dar kartą.');
      setStatus('error');
    }
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

  const sending = status === 'sending';

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
        <button type="submit" className="btn-accent shrink-0" disabled={sending}>
          {sending ? 'Siunčiama...' : 'Užsiprenumeruoti'}
          {sending ? null : <IconArrowRight size={18} />}
        </button>
      </div>

      {/* Honeypot - hidden from humans, harvested by bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="waitlist-company">Įmonė</label>
        <input
          id="waitlist-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
        />
      </div>

      {status === 'error' ? (
        <p id="waitlist-error" role="alert" className="mt-2 px-1 text-sm text-accent">
          {errorText}
        </p>
      ) : null}
    </form>
  );
}
