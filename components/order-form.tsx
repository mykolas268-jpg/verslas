'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { IconArrowRight, IconCheck } from './icons';

type Status = 'idle' | 'sending' | 'error' | 'success';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_MIN = 5;

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

/**
 * Contact form for the AI consultation offer. Submits to /api/leads, which
 * stores the enquiry in Supabase. No mail client involved.
 */
export function OrderForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [company, setCompany] = useState(''); // honeypot
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [formError, setFormError] = useState('');

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (name.trim().length === 0) next.name = 'Įrašyk savo vardą.';
    if (!EMAIL_RE.test(email.trim())) next.email = 'Įvesk teisingą el. pašto adresą.';
    if (message.trim().length < MESSAGE_MIN)
      next.message = 'Parašyk bent vieną sakinį apie savo verslą.';
    return next;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus('error');
      return;
    }

    setStatus('sending');
    setFormError('');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'consultation',
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: message.trim(),
          sourcePath: window.location.pathname,
          company,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setFormError(data?.error ?? 'Nepavyko išsiųsti. Pabandyk dar kartą.');
        setStatus('error');
        return;
      }

      setStatus('success');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch {
      setFormError('Nepavyko išsiųsti - patikrink interneto ryšį ir pabandyk dar kartą.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        className="rounded-2xl border border-accent/40 bg-accent/10 p-6 text-sm text-ink"
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-accent-fg">
          <IconCheck size={18} />
        </span>
        <p className="mt-4 font-medium">Užklausa gauta. Ačiū!</p>
        <p className="mt-2 text-muted">
          Susisieksiu su tavimi el. paštu per 1-2 darbo dienas ir suderinsim
          laiką 30 min. pokalbiui.
        </p>
      </div>
    );
  }

  const sending = status === 'sending';

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="order-name" className="mb-1.5 block text-sm font-medium text-ink">
            Vardas
          </label>
          <input
            id="order-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'order-name-error' : undefined}
            placeholder="Vardas"
            className="field"
          />
          {errors.name ? (
            <p id="order-name-error" role="alert" className="mt-1.5 px-1 text-sm text-accent">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="order-email" className="mb-1.5 block text-sm font-medium text-ink">
            El. paštas
          </label>
          <input
            id="order-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'order-email-error' : undefined}
            placeholder="vardas@imone.lt"
            className="field"
          />
          {errors.email ? (
            <p id="order-email-error" role="alert" className="mt-1.5 px-1 text-sm text-accent">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="order-phone" className="mb-1.5 block text-sm font-medium text-ink">
          Telefonas <span className="font-normal text-muted">(nebūtina)</span>
        </label>
        <input
          id="order-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+370 6xx xxxxx"
          className="field"
        />
      </div>

      <div>
        <label htmlFor="order-message" className="mb-1.5 block text-sm font-medium text-ink">
          Papasakok apie savo verslą
        </label>
        <textarea
          id="order-message"
          name="message"
          rows={4}
          required
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
            if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
          }}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'order-message-error' : undefined}
          placeholder={`Pvz.: turiu nedidelę kavinę ir noriu sužinoti, kaip AI galėtų padėti su klientų aptarnavimu ir rinkodaros turiniu.`}
          className="w-full rounded-2xl border border-line bg-card px-5 py-3 text-sm text-ink transition-colors"
        />
        {errors.message ? (
          <p id="order-message-error" role="alert" className="mt-1.5 px-1 text-sm text-accent">
            {errors.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot - hidden from humans, harvested by bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="order-company">Įmonė</label>
        <input
          id="order-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" className="btn-accent" disabled={sending}>
          {sending ? 'Siunčiama...' : 'Siųsti užklausą'}
          {sending ? null : <IconArrowRight size={18} />}
        </button>
        <p className="text-sm text-muted">
          Atsakysiu el. paštu per 1-2 darbo dienas.
        </p>
      </div>

      {formError ? (
        <p role="alert" className="px-1 text-sm text-accent">
          {formError}
        </p>
      ) : null}
    </form>
  );
}
