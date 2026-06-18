import { load, CORE_SCHEMA } from 'js-yaml';

export interface ParsedMatter {
  data: Record<string, unknown>;
  content: string;
}

// Leading `---` ... `---` block (tolerant of CRLF and a trailing newline).
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

/**
 * Minimal frontmatter parser. Splits the leading YAML block from the MDX body
 * and parses it with the maintained js-yaml@4 (safe `load` — never executes
 * custom YAML types). Replaces the unmaintained `gray-matter` dependency,
 * which bundled a vulnerable js-yaml@3.
 */
export function parseFrontmatter(raw: string): ParsedMatter {
  const normalized = raw.replace(/^﻿/, ''); // strip BOM if present
  const match = normalized.match(FRONTMATTER_RE);

  if (!match) {
    return { data: {}, content: normalized };
  }

  const yaml = match[1];
  const content = normalized.slice(match[0].length);
  // CORE_SCHEMA keeps `date: 2026-06-10` as a string (the default schema would
  // coerce it to a JS Date) while still parsing booleans, numbers and arrays.
  const parsed = load(yaml, { schema: CORE_SCHEMA }) ?? {};

  if (typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Frontmatter must be a YAML mapping (key: value pairs).');
  }

  return { data: parsed as Record<string, unknown>, content };
}
