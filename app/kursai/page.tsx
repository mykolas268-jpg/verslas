import type { Metadata } from 'next';
import Link from 'next/link';
import { courses } from '@/lib/courses';
import type { Course } from '@/lib/courses';
import { PageHeader } from '@/components/page-header';
import { WaitlistForm } from '@/components/waitlist-form';
import { Reveal } from '@/components/reveal';
import { Tag } from '@/components/tag';
import { IconArrowRight, IconClock } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Kursai',
  description:
    'Praktiniai „verslas.ai“ kursai apie dirbtinį intelektą versle. Netrukus startuojam — palik el. paštą ir pranešime pirmiems.',
  alternates: { canonical: '/kursai' },
};

function CourseCard({ course }: { course: Course }) {
  const isAvailable = course.status === 'available' && course.href;

  const inner = (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">
          {course.level}
        </span>
        {isAvailable ? null : (
          <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
            Netrukus
          </span>
        )}
      </div>

      <h3 className="mt-4 font-serif text-2xl leading-snug">{course.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
        {course.summary}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {course.topics.map((topic) => (
          <Tag key={topic} label={topic} />
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-sm text-muted">
        <span className="inline-flex items-center gap-1.5">
          <IconClock size={15} />
          {course.duration}
        </span>
        {isAvailable ? (
          <span className="inline-flex items-center gap-1 font-medium text-accent">
            Pradėti
            <IconArrowRight size={16} />
          </span>
        ) : null}
      </div>
    </>
  );

  const baseClass =
    'flex h-full flex-col rounded-2xl border border-line bg-card p-6';

  if (isAvailable) {
    return (
      <Link
        href={course.href as string}
        className={`${baseClass} transition-colors hover:border-accent`}
      >
        {inner}
      </Link>
    );
  }

  return <div className={`${baseClass} opacity-90`}>{inner}</div>;
}

export default function KursaiPage() {
  return (
    <div className="mx-auto max-w-content px-5 py-12 sm:px-8 sm:py-16">
      <Reveal>
        <PageHeader
          eyebrow="Kursai"
          title="Kursai netrukus"
          description="Ruošiame praktinius kursus, kurie padės pritaikyti dirbtinį intelektą tavo versle — nuo pirmo prompto iki realaus rezultato. Užsirašyk, ir pranešime pirmiems."
        />
      </Reveal>

      {/* Waitlist */}
      <Reveal>
        <section
          aria-labelledby="waitlist-heading"
          className="mt-10 rounded-3xl border border-line bg-surface p-6 sm:p-10"
        >
          <h2 id="waitlist-heading" className="font-serif text-xl sm:text-2xl">
            Palik el. paštą — pranešime, kai startuosim
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Be spamo. Parašysime tik tada, kai kursai bus paruošti, ir
            ankstyviesiems pasiūlysime nuolaidą.
          </p>
          <div className="mt-6 max-w-xl">
            <WaitlistForm />
          </div>
        </section>
      </Reveal>

      {/* Course preview cards */}
      <section aria-labelledby="courses-heading" className="mt-16">
        <h2
          id="courses-heading"
          className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-muted"
        >
          Ką ruošiame
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {courses.map((course, index) => (
            <Reveal key={course.slug} delay={index * 70}>
              <CourseCard course={course} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
