import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/lib/site';
import {
  offer,
  offerHighlights,
  offerSteps,
  offerIncludes,
  offerExcludes,
  useCases,
} from '@/lib/offer';
import type { UseCase } from '@/lib/offer';
import { OrderForm } from '@/components/order-form';
import { Reveal } from '@/components/reveal';
import { JsonLd } from '@/components/json-ld';
import {
  IconArrowRight,
  IconArrowUpRight,
  IconCheck,
  IconClock,
  IconSpark,
} from '@/components/icons';

const priceLabel = `${offer.price} ${offer.currency}`;

export const metadata: Metadata = {
  title: `Reklaminis video verslui – ${priceLabel}, per 4 dienas`,
  description:
    'Trumpas reklaminis video tavo verslui už 99 €, paruoštas per 4 darbo dienas. Skirta „Instagram", „TikTok" ir „Facebook" reklamai. Užsisakyk internetu.',
  alternates: { canonical: '/reklaminis-video' },
  openGraph: {
    type: 'website',
    url: `${siteConfig.url}/reklaminis-video`,
    title: `Reklaminis video verslui – ${priceLabel}`,
    description:
      'Trumpas, reklamai paruoštas klipas per 4 darbo dienas. „Instagram", „TikTok" ir „Facebook" reklamai.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Reklaminis video verslui',
  serviceType: 'Reklaminio video kūrimas',
  description:
    'Trumpi reklaminiai video (20–30 sek.) Lietuvos smulkiam ir vidutiniam verslui socialinių tinklų reklamai. Paruošiama per 4 darbo dienas.',
  provider: {
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
  },
  areaServed: { '@type': 'Country', name: 'Lietuva' },
  inLanguage: 'lt',
  offers: {
    '@type': 'Offer',
    price: String(offer.price),
    priceCurrency: 'EUR',
    url: `${siteConfig.url}/reklaminis-video`,
    availability: 'https://schema.org/InStock',
  },
};

function StepCard({ step, index }: { step: (typeof offerSteps)[number]; index: number }) {
  return (
    <div className="relative flex flex-col rounded-2xl border border-line bg-card p-6">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-accent/12 font-serif text-lg text-accent">
        {index + 1}
      </span>
      <h3 className="mt-4 font-serif text-lg leading-snug">{step.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
    </div>
  );
}

function UseCaseCard({ item }: { item: UseCase }) {
  const media = (
    <>
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        {item.poster ? (
          <Image
            src={item.poster}
            alt={`${item.title} — pavyzdinis reklaminio video formatas`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
            className="object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid h-full place-items-center bg-gradient-to-br from-accent/25 to-accent/5 text-accent transition-transform duration-500 ease-out-expo group-hover:scale-[1.03]">
            <IconSpark size={72} />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-bg/85 px-2.5 py-0.5 text-xs font-medium text-ink backdrop-blur-sm">
          {item.category}
        </span>
        {item.videoUrl ? (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-fg">
            Žiūrėti
            <IconArrowUpRight size={13} />
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-lg leading-snug">{item.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
      </div>
    </>
  );

  const baseClass =
    'group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card';

  if (item.videoUrl) {
    return (
      <a
        href={item.videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} transition-colors hover:border-accent`}
      >
        {media}
      </a>
    );
  }

  return <div className={baseClass}>{media}</div>;
}

export default function ReklaminisVideoPage() {
  return (
    <div className="mx-auto max-w-content px-5 sm:px-8">
      <JsonLd data={jsonLd} />

      {/* Hero */}
      <section className="relative py-16 sm:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-6 -z-10 hidden text-accent/[0.06] lg:block"
        >
          <IconSpark size={320} />
        </div>
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1 text-xs font-medium text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Reklaminis video verslui
          </p>
          <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-[1.05] sm:text-6xl">
            Reklaminis video tavo verslui — {priceLabel}, per {offer.deliveryLabel}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Trumpas, reklamai paruoštas klipas be filmavimo grupės ir be
            tūkstantinių sąskaitų. Parodyk produktą ten, kur klientai jau žiūri —
            „Instagram“, „TikTok“ ir „Facebook“.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#uzsakyti" className="btn-accent">
              Užsisakyk video
              <IconArrowRight size={18} />
            </a>
            <a href="#pavyzdziai" className="btn-outline">
              Pamatyk pavyzdžius
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
            {offerHighlights.map((highlight) => (
              <li key={highlight} className="inline-flex items-center gap-1.5">
                <IconCheck size={15} className="text-accent" />
                {highlight}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* How it works */}
      <section aria-labelledby="kaip-heading" className="py-10">
        <Reveal>
          <h2
            id="kaip-heading"
            className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-muted"
          >
            Kaip tai veikia
          </h2>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {offerSteps.map((step, index) => (
            <Reveal key={step.title} delay={index * 70}>
              <StepCard step={step} index={index} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Use cases / examples */}
      <section
        id="pavyzdziai"
        aria-labelledby="pavyzdziai-heading"
        className="scroll-mt-24 py-14"
      >
        <Reveal>
          <div className="mb-6 max-w-xl">
            <h2 id="pavyzdziai-heading" className="font-serif text-2xl sm:text-3xl">
              Ką galime padaryti
            </h2>
            <p className="mt-3 text-muted">
              Formatai, kurie geriausiai veikia Lietuvos smulkiam verslui.
              Konkretų klipą pritaikom tavo produktui.
            </p>
          </div>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((item, index) => (
            <Reveal key={item.title} delay={index * 70}>
              <UseCaseCard item={item} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section aria-labelledby="kaina-heading" className="py-10">
        <Reveal>
          <div className="grid gap-6 rounded-3xl border border-line bg-surface p-6 sm:p-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Fiksuota kaina
              </p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-serif text-6xl leading-none">{offer.price}</span>
                <span className="font-serif text-3xl text-muted">{offer.currency}</span>
              </div>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
                Vienas klipas, fiksuota kaina, jokių paslėptų mokesčių. Reikia
                kelių per mėnesį? Parašyk — suderinsim.
              </p>
              <a href="#uzsakyti" className="btn-accent mt-6">
                Užsisakyk video
                <IconArrowRight size={18} />
              </a>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h2 id="kaina-heading" className="font-serif text-lg">
                  Kas įskaičiuota
                </h2>
                <ul className="mt-4 space-y-3">
                  {offerIncludes.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm text-ink">
                      <IconCheck size={16} className="mt-0.5 shrink-0 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="font-serif text-lg text-muted">Ko nėra už šią kainą</h2>
                <ul className="mt-4 space-y-3">
                  {offerExcludes.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm text-muted">
                      <IconClock size={16} className="mt-0.5 shrink-0 opacity-60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Order form */}
      <section id="uzsakyti" aria-labelledby="uzsakyti-heading" className="scroll-mt-24 py-14">
        <Reveal>
          <div className="rounded-3xl border border-line bg-card p-6 sm:p-10">
            <div className="max-w-xl">
              <h2 id="uzsakyti-heading" className="font-serif text-2xl sm:text-3xl">
                Užsisakyk arba paklausk
              </h2>
              <p className="mt-3 text-muted">
                Parašyk vieną eilutę apie tai, ką reklamuoji — atsiųsim pavyzdį ir
                aiškią kainą. Be įsipareigojimų.
              </p>
            </div>
            <div className="mt-8 max-w-2xl">
              <OrderForm />
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
