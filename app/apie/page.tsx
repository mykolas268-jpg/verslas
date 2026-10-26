import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Reveal } from '@/components/reveal';
import { IconArrowRight, IconCheck } from '@/components/icons';

const team = [
  {
    name: 'Vytautas',
    role: 'CEO',
    image: '/images/team/vytautas.webp',
    bio: 'Strateginė verslo kryptis ir augimo planavimas. Daugiau nei 15 metų patirties kuriant ir vystant smulkų bei vidutinį verslą Lietuvoje.',
  },
  {
    name: 'Goda',
    role: 'Rinkodaros specialistė',
    image: '/images/team/goda.webp',
    bio: 'Turinio strategija, SEO ir socialinių tinklų rinkodara. Padeda verslams rasti savo balsą ir pasiekti klientus ten, kur jie jau yra.',
  },
  {
    name: 'Tomas',
    role: 'Techninių sistemų kūrimas',
    image: '/images/team/tomas.webp',
    bio: 'Programavimas, AI integracijų diegimas ir automatizavimas. Paverčia verslo procesus veikiančiomis techninėmis sistemomis.',
  },
] as const;

export const metadata: Metadata = {
  title: 'Apie',
  description:
    'Kas yra „verslas.ai“ ir kam skirtas šis tinklaraštis: praktinis dirbtinio intelekto pritaikymas mažam ir vidutiniam Lietuvos verslui.',
  alternates: { canonical: '/apie' },
};

const principles = [
  'Konkretūs pavyzdžiai, o ne teorija - kiekvienas straipsnis turi realų scenarijų.',
  'Paruošti promptai, kuriuos gali nukopijuoti ir pritaikyti šiandien.',
  'Jokio rinkodarinio triukšmo apie „revoliuciją” - tik tai, kas veikia versle.',
];

export default function ApiePage() {
  return (
    <div className="mx-auto max-w-content px-5 py-12 sm:px-8 sm:py-16">
      <Reveal>
        <PageHeader
          eyebrow="Apie"
          title="Apie verslas.ai"
          description=”„verslas.ai” - tinklaraštis apie tai, kaip dirbtinį intelektą realiai pritaikyti versle. Be teorijos, be hype'o, su pavyzdžiais.”
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
              Mes paimame realią verslo situaciją - klientų aptarnavimą, turinio
              kūrimą, pasikartojančius procesus - ir parodome, kaip ją išspręsti
              su AI žingsnis po žingsnio. Tokia forma, kad galėtum pakartoti pats.
            </p>

            <h2>Ko čia nerasi</h2>
            <p>
              Nerasi pažadų apie stebuklus ar baimės, kad robotai užims visus
              darbus. AI čia - tai įrankis, nuimantis nuobodžią, pasikartojančią
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
      {/* ── Komanda ── */}
      <Reveal>
        <section className="mt-16 border-t border-line pt-12">
          <h2 className="font-serif text-2xl sm:text-3xl">Mūsų komanda</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            Už „verslas.ai" stovi komanda, kuri jungia verslo patirtį,
            rinkodaros žinias ir technologinį supratimą.
          </p>

          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="mx-auto h-40 w-40 overflow-hidden rounded-full border-2 border-line">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={160}
                    height={160}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mt-5 font-serif text-lg">{member.name}</h3>
                <p className="text-sm font-medium text-accent">{member.role}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  );
}
