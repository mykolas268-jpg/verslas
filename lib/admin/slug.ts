/** Transliterates Lithuanian diacritics so slugs are clean ASCII kebab-case. */
const LT_MAP: Record<string, string> = {
  ą: 'a',
  č: 'c',
  ę: 'e',
  ė: 'e',
  į: 'i',
  š: 's',
  ų: 'u',
  ū: 'u',
  ž: 'z',
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[ąčęėįšųūž]/g, (char) => LT_MAP[char] ?? char)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip any remaining combining marks
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}
