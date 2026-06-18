/** Lithuanian-language formatting helpers. */

const LT_MONTHS_GENITIVE = [
  'sausio',
  'vasario',
  'kovo',
  'balandžio',
  'gegužės',
  'birželio',
  'liepos',
  'rugpjūčio',
  'rugsėjo',
  'spalio',
  'lapkričio',
  'gruodžio',
];

/**
 * Formats an ISO date (YYYY-MM-DD) as a Lithuanian long date, e.g.
 * "2026 m. birželio 17 d.". Parsed manually to avoid timezone drift.
 */
export function formatDateLt(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const monthName = LT_MONTHS_GENITIVE[(month ?? 1) - 1] ?? '';
  return `${year} m. ${monthName} ${day} d.`;
}

/** Reading-time label per the brand spec: "X min skaitymo". */
export function readingLabelLt(minutes: number): string {
  return `${minutes} min skaitymo`;
}
