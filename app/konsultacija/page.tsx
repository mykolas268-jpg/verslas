import type { Metadata } from 'next';
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
  IconCheck,
  IconClock,
  IconSpark,
} from '@/components/icons';

export const metadata: Metadata = {
  title: 'Nemokama AI konsultacija verslui - verslas.ai',
  description:
    'Nemokama 30 min. AI konsultacija tavo verslui. Aptarsime, kaip dirbtinis intelektas gali padėti konkrečiai tavo situacijoje. Be įsipareigojimų.',
  alternates: { canonical: '/konsultacija' },
  openGraph: {
    type: 'website',
    url: `${siteConfig.url}/konsultacija`,
    title: 'Nemokama AI konsultacija verslui',
    description:
      '30 min. pokalbis apie tai, kaip AI gali padėti tavo verslui. Konkretūs patarimai, be įsipareigojimų.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Nemokama AI konsultacija verslui',
  serviceType: 'AI konsultacija',
  description:
    'Nemokama 30 minučių AI konsultacija Lietuvos smulkiam ir vidutiniam verslui. Individualūs patarimai, kaip pritaikyti dirbtinį intelektą konkrečioje verslo situacijoje.',
  provider: {
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
  },
  areaServed: { '@type': 'Country', name: 'Lietuva' },
  inLanguage: 'lt',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
    url: `${siteConfig.url}/konsultacija`,
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
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        <div className="grid h-full place-items-center bg-gradient-to-br from-accent/25 to-accent/5 text-accent transition-transform duration-500 ease-out-expo group-hover:scale-[1.03]">
          <IconSpark size={72} />
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-bg/85 px-2.5 py-0.5 text-xs font-medium text-ink backdrop-blur-sm">
          {item.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-lg leading-snug">{item.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
      </div>
    </div>
  );
}

export default function KonsultacijaPage() {
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
            AI konsultacija verslui
          </p>
          <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-[1.05] sm:text-6xl">
            Nemokama AI konsultacija tavo verslui
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            30 min. pokalbis apie tai, kaip dirbtinis intelektas gali padėti
            konkrečiai tavo verslui. Be teorijos, be įsipareigojimų - tik
            praktiniai patarimai, kuriuos gali pritaikyti iš karto.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#uzsiregistruoti" className="btn-accent">
              Užsiregistruok konsultacijai
              <IconArrowRight size={18} />
            </a>
            <a href="#kam-tinka" className="btn-outline">
              Kam tai tinka
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

      {/* Use cases */}
      <section
        id="kam-tinka"
        aria-labelledby="kam-tinka-heading"
        className="scroll-mt-24 py-14"
      >
        <Reveal>
          <div className="mb-6 max-w-xl">
            <h2 id="kam-tinka-heading" className="font-serif text-2xl sm:text-3xl">
              Kam tai tinka
            </h2>
            <p className="mt-3 text-muted">
              Padedame Lietuvos smulkiam verslui rasti konkrečius būdus,
              kaip AI gali sutaupyti laiko ir padidinti efektyvumą.
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

      {/* What's included */}
      <section aria-labelledby="apimtis-heading" className="py-10">
        <Reveal>
          <div className="grid gap-6 rounded-3xl border border-line bg-surface p-6 sm:p-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Kaina
              </p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-serif text-5xl leading-none">{offer.priceLabel}</span>
              </div>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
                Pirma konsultacija visiškai nemokama. Jokių paslėptų mokesčių
                ar automatinių pratęsimų. Jei prireiks nuolatinės pagalbos -
                aptarsim atskirai.
              </p>
              <a href="#uzsiregistruoti" className="btn-accent mt-6">
                Užsiregistruok
                <IconArrowRight size={18} />
              </a>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h2 id="apimtis-heading" className="font-serif text-lg">
                  Ką gauni
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
                <h2 className="font-serif text-lg text-muted">Ko neapima</h2>
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

      {/* Registration form */}
      <section id="uzsiregistruoti" aria-labelledby="uzsiregistruoti-heading" className="scroll-mt-24 py-14">
        <Reveal>
          <div className="rounded-3xl border border-line bg-card p-6 sm:p-10">
            <div className="max-w-xl">
              <h2 id="uzsiregistruoti-heading" className="font-serif text-2xl sm:text-3xl">
                Užsiregistruok konsultacijai
              </h2>
              <p className="mt-3 text-muted">
                Parašyk keliais sakiniais, kuo užsiimi ir kur norėtum pritaikyti AI.
                Susisieksim per 1-2 darbo dienas.
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
