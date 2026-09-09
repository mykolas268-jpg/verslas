'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { siteConfig } from '@/lib/site';
import { IconArrowRight, IconCheck } from './icons';

type Status = 'idle' | 'error' | 'success';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_MIN = 5;

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

function buildMailto(fields: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): string {
  const subject = `Video užsakymas — ${fields.name}`;
  const bodyLines = [
    `Vardas: ${fields.name}`,
    `El. paštas: ${fields.email}`,
    fields.phone ? `Telefonas: ${fields.phone}` : null,
    '',
    'Ką noriu reklamuoti:',
    fields.message,
  ].filter((line): line is string => line !== null);

  const params = new URLSearchParams({
    subject,
    body: bodyLines.join('\n'),
  });
  // URLSearchParams encodes spaces as "+"; mail clients expect %20 in the body.
  return `mailto:${siteConfig.contactEmail}?${params.toString().replace(/\+/g, '%20')}`;
}

/**
 * Order/contact form for the reklaminis-video offer. Submits by opening a
 * prefilled email to siteConfig.contactEmail — works with no backend. The
 * address is also shown as a plain fallback for webmail users.
 *
 * TODO: for guaranteed delivery, POST to an API route wired to Resend/Formspree
 * instead of relying on the visitor's mail client.
 */
export function OrderForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (name.trim().length === 0) next.name = 'Įrašyk savo vardą.';
    if (!EMAIL_RE.test(email.trim())) next.email = 'Įvesk teisingą el. pašto adresą.';
    if (message.trim().length < MESSAGE_MIN)
      next.message = 'Parašyk bent vieną sakinį apie tai, ką reklamuoji.';
    return next;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus('error');
      return;
    }

    const href = buildMailto({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message: message.trim(),
    });
    window.location.href = href;
    setStatus('success');
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
        <p className="mt-4 font-medium">Atsidarys tavo el. pašto programa.</p>
        <p className="mt-2 text-muted">
          Užpildyta žinutė jau paruošta — tereikia paspausti „Siųsti“. Jei
          programa neatsidarė, parašyk tiesiogiai:{' '}
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="font-medium text-accent underline underline-offset-2"
          >
            {siteConfig.contactEmail}
          </a>
          .
        </p>
      </div>
    );
  }

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
          Ką nori reklamuoti?
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
          placeholder="Pvz.: nauja pavasario akcija kavinei, vertikalus klipas „Instagram“ reklamai."
          className="w-full rounded-2xl border border-line bg-card px-5 py-3 text-sm text-ink transition-colors"
        />
        {errors.message ? (
          <p id="order-message-error" role="alert" className="mt-1.5 px-1 text-sm text-accent">
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" className="btn-accent">
          Siųsti užklausą
          <IconArrowRight size={18} />
        </button>
        <p className="text-sm text-muted">
          Arba parašyk tiesiogiai:{' '}
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="font-medium text-accent underline underline-offset-2"
          >
            {siteConfig.contactEmail}
          </a>
        </p>
      </div>
    </form>
  );
}
