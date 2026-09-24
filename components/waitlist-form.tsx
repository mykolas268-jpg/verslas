'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { mailtoHref, sourceArticlePath, submitInquiry } from '@/lib/inquiry-client';
import { IconArrowRight, IconCheck } from './icons';

/** `sent` = stored via the API; `mailto` = prefilled email opened instead. */
type Status = 'idle' | 'error' | 'sending' | 'sent' | 'mailto' | 'failed';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Waitlist capture. Posts to /api/uzklausa; when server delivery is not
 * configured it opens a prefilled email, and says so — the visitor is never
 * told they are on the list unless the request actually went somewhere.
 */
export function WaitlistForm({ list = 'kursai' }: { list?: string }) {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;
    const trimmed = email.trim();

    if (!EMAIL_RE.test(trimmed)) {
      setStatus('error');
      return;
    }

    const source = sourceArticlePath();
    setStatus('sending');
    const result = await submitInquiry({ kind: 'waitlist', list, email: trimmed, source, website });
    if (result === 'sent') {
      setStatus('sent');
      setEmail('');
    } else if (result === 'fallback') {
      window.location.href = mailtoHref(`Laukiančiųjų sąrašas: ${list}`, [
        'Noriu gauti pranešimą, kai startuosite.',
        `El. paštas: ${trimmed}`,
        source ? `(Atėjau iš: ${source})` : '',
      ]);
      setStatus('mailto');
    } else {
      setStatus('failed');
    }
  }

  if (status === 'mailto') {
    return (
      <div
        role="status"
        className="rounded-2xl border border-accent/40 bg-accent/10 px-5 py-4 text-sm text-ink"
      >
        Atsidarys tavo el. pašto programa. Išsiųsk paruoštą laišką, ir įrašysime
        tave į sąrašą.
      </div>
    );
  }

  if (status === 'sent') {
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
        <button type="submit" className="btn-accent shrink-0" disabled={status === 'sending'}>
          {status === 'sending' ? 'Siunčiama…' : 'Užsiprenumeruoti'}
          <IconArrowRight size={18} />
        </button>
      </div>
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="waitlist-website">Svetainė</label>
        <input
          id="waitlist-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>
      {status === 'failed' ? (
        <p role="alert" className="mt-2 px-1 text-sm text-accent">
          Nepavyko išsiųsti. Pabandyk dar kartą vėliau.
        </p>
      ) : null}
      {status === 'error' ? (
        <p id="waitlist-error" role="alert" className="mt-2 px-1 text-sm text-accent">
          Įvesk teisingą el. pašto adresą.
        </p>
      ) : null}
    </form>
  );
}
