import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Reveal } from '@/components/reveal';
import { IconArrowRight, IconCheck } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Apie',
  description:
    'Kas yra „verslas.ai“ ir kam skirtas šis tinklaraštis: praktinis dirbtinio intelekto pritaikymas mažam ir vidutiniam Lietuvos verslui.',
  alternates: { canonical: '/apie' },
};

const principles = [
  'Konkretūs pavyzdžiai, o ne teorija — kiekvienas straipsnis turi realų scenarijų.',
  'Paruošti promptai, kuriuos gali nukopijuoti ir pritaikyti šiandien.',
  'Jokio rinkodarinio triukšmo apie „revoliuciją“ — tik tai, kas veikia versle.',
];

export default function ApiePage() {
  return (
    <div className="mx-auto max-w-content px-5 py-12 sm:px-8 sm:py-16">
      <Reveal>
        <PageHeader
          eyebrow="Apie"
          title="Apie verslas.ai"
          description="„verslas.ai“ — tinklaraštis apie tai, kaip dirbtinį intelektą realiai pritaikyti versle. Be teorijos, be hype'o, su pavyzdžiais."
        />
      </Reveal>

      <div className="mt-12 grid gap-12 md:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <div className="prose max-w-none prose-headings:font-serif">
            <h2>Kam tai skirta</h2>
            <p>
              Šis tinklaraštis skirtas mažo ir vidutinio Lietuvos verslo
              savininkams bei komandoms, kurie nori naudoti dirbtinį intelektą
              kasdieniame darbe, bet neturi laiko skaityti akademinių straipsnių
              ar techninės dokumentacijos.
            </p>
            <p>
              Mes paimame realią verslo situaciją — klientų aptarnavimą, turinio
              kūrimą, pasikartojančius procesus — ir parodome, kaip ją išspręsti
              su AI žingsnis po žingsnio. Tokia forma, kad galėtum pakartoti pats.
            </p>

            <h2>Ko čia nerasi</h2>
            <p>
              Nerasi pažadų apie stebuklus ar baimės, kad robotai užims visus
              darbus. AI čia — tai įrankis, nuimantis nuobodžią, pasikartojančią
              darbo dalį, kad žmogui liktų tai, kas svarbu.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <aside className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
            <h2 className="font-serif text-xl">Mūsų principai</h2>
            <ul className="mt-5 space-y-4">
              {principles.map((principle) => (
                <li key={principle} className="flex gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                    <IconCheck size={15} />
                  </span>
                  <span className="text-sm leading-relaxed text-ink">
                    {principle}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-line pt-6">
              <p className="text-sm text-muted">
                Nori pradėti? Peržiūrėk straipsnius arba užsirašyk į būsimus
                kursus.
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <Link href="/straipsniai" className="btn-accent">
                  Skaityti straipsnius
                  <IconArrowRight size={18} />
                </Link>
                <Link href="/kursai" className="btn-outline">
                  Apie kursus
                </Link>
              </div>
            </div>
          </aside>
        </Reveal>
      </div>
    </div>
  );
}
