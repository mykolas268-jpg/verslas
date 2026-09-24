#!/usr/bin/env node
/**
 * Content checks for content/straipsniai/*.mdx that the build alone does not
 * catch. Used by CI and by the article pipeline before it opens a PR.
 *
 * Errors (exit 1):
 *   - unsafe MDX: import/export, JS expressions, JSX attribute expressions,
 *     or any JSX element other than the allowed components
 *   - file name does not match `<slug>.mdx`
 *   - internal links to missing articles/pages, missing local images
 * Warnings (errors with --strict, and always for `aiAssisted: true` files):
 *   - <title> longer than 60 characters, excerpt outside 120–160 characters
 *   - straight double quotes in Lithuanian prose, relative time words
 *
 * Usage: node scripts/check-content.mjs [--strict] [file.mdx ...]
 */
import fs from 'node:fs';
import path from 'node:path';
import { load, CORE_SCHEMA } from 'js-yaml';
import { createProcessor } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'content', 'straipsniai');
const PUBLIC_DIR = path.join(ROOT, 'public');

const ALLOWED_COMPONENTS = new Set(['Callout', 'ProseImage']);
const STATIC_ROUTES = new Set([
  '/',
  '/reklaminis-video',
  '/straipsniai',
  '/kursai',
  '/apie',
  '/kaip-rengiame-straipsnius',
  '/privatumo-politika',
]);
const TITLE_SUFFIX = ' · verslas.ai';
const MAX_TITLE = 60;
const EXCERPT_MIN = 120;
const EXCERPT_MAX = 160;
// Unicode-aware word boundaries (\b is ASCII-only and misses words starting with š/ą/…).
const RELATIVE_TIME = /(?<!\p{L})(vakar|šiandien|rytoj|šią savaitę|praėjusią savaitę|šį mėnesį|neseniai|ką tik)(?!\p{L})/iu;

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

const args = process.argv.slice(2);
const strictAll = args.includes('--strict');
const explicitFiles = args.filter((arg) => !arg.startsWith('--'));

function listFiles() {
  if (explicitFiles.length > 0) return explicitFiles.map((file) => path.resolve(file));
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
    .map((file) => path.join(CONTENT_DIR, file));
}

function readArticle(file) {
  const raw = fs.readFileSync(file, 'utf8').replace(/^﻿/, '');
  const match = raw.match(FRONTMATTER_RE);
  if (!match) return { data: {}, body: raw, bodyOffsetLines: 0 };
  const data = load(match[1], { schema: CORE_SCHEMA }) ?? {};
  const bodyOffsetLines = match[0].split('\n').length - 1;
  return { data, body: raw.slice(match[0].length), bodyOffsetLines };
}

function walk(node, visit, ancestors = []) {
  visit(node, ancestors);
  if (Array.isArray(node.children)) {
    for (const child of node.children) walk(child, visit, [...ancestors, node]);
  }
}

function localFileExists(urlPath) {
  const clean = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  return fs.existsSync(path.join(PUBLIC_DIR, clean));
}

const files = listFiles();
const contentFiles = fs.existsSync(CONTENT_DIR)
  ? fs
      .readdirSync(CONTENT_DIR)
      .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
      .map((file) => path.join(CONTENT_DIR, file))
  : [];
// Link targets: every article in the repo plus any file checked explicitly.
const allSlugs = new Set(
  [...contentFiles, ...files].map((file) => readArticle(file).data.slug).filter(Boolean),
);

const processor = createProcessor({ remarkPlugins: [remarkGfm] });
let errorCount = 0;
let warningCount = 0;

for (const file of files) {
  const rel = path.relative(ROOT, file);
  const { data, body, bodyOffsetLines } = readArticle(file);
  const strict = strictAll || data.aiAssisted === true;
  const errors = [];
  const warnings = [];
  const at = (node) =>
    node?.position ? `:${node.position.start.line + bodyOffsetLines}` : '';

  // File naming: storage (admin panel, pipeline) addresses posts as <slug>.mdx.
  const baseName = path.basename(file).replace(/\.mdx?$/, '');
  if (data.slug && data.slug !== baseName) {
    errors.push(`file name "${path.basename(file)}" must be "${data.slug}.mdx"`);
  }

  // Front matter length checks.
  if (typeof data.title === 'string') {
    const base = typeof data.seoTitle === 'string' ? data.seoTitle : data.title;
    if (base.length > MAX_TITLE) {
      warnings.push(
        `<title> "${base}" is ${base.length} chars (max ${MAX_TITLE}); add a shorter seoTitle`,
      );
    }
  }
  if (typeof data.excerpt === 'string') {
    const length = data.excerpt.length;
    if (length < EXCERPT_MIN || length > EXCERPT_MAX) {
      warnings.push(`excerpt is ${length} chars (target ${EXCERPT_MIN}–${EXCERPT_MAX})`);
    }
  }
  if (typeof data.cover === 'string' && data.cover.startsWith('/') && !localFileExists(data.cover)) {
    errors.push(`cover image not found in public/: ${data.cover}`);
  }

  let tree;
  try {
    tree = processor.parse(body);
  } catch (error) {
    errors.push(`MDX parse error: ${error.message}`);
  }

  if (tree) {
    walk(tree, (node, ancestors) => {
      switch (node.type) {
        case 'mdxjsEsm':
          errors.push(`import/export is not allowed${at(node)}`);
          break;
        case 'mdxFlowExpression':
        case 'mdxTextExpression':
          errors.push(`JS expression {…} is not allowed${at(node)}`);
          break;
        case 'mdxJsxFlowElement':
        case 'mdxJsxTextElement': {
          if (!ALLOWED_COMPONENTS.has(node.name ?? '')) {
            errors.push(`component <${node.name ?? 'fragment'}> is not allowed${at(node)}`);
          }
          for (const attribute of node.attributes ?? []) {
            if (attribute.type !== 'mdxJsxAttribute' || typeof attribute.value === 'object') {
              errors.push(`JSX attribute expressions are not allowed${at(node)}`);
            }
            if (
              node.name === 'ProseImage' &&
              attribute.name === 'src' &&
              typeof attribute.value === 'string' &&
              attribute.value.startsWith('/') &&
              !localFileExists(attribute.value)
            ) {
              errors.push(`image not found in public/: ${attribute.value}${at(node)}`);
            }
          }
          break;
        }
        case 'link':
        case 'image': {
          const url = node.url ?? '';
          if (url.startsWith('/')) {
            const pathname = url.split(/[?#]/)[0].replace(/\/$/, '') || '/';
            const articleMatch = pathname.match(/^\/straipsniai\/([^/]+)$/);
            if (node.type === 'image' || pathname.startsWith('/images/')) {
              if (!localFileExists(pathname)) errors.push(`file not found in public/: ${url}${at(node)}`);
            } else if (articleMatch) {
              if (!allSlugs.has(articleMatch[1])) {
                errors.push(`link to missing article: ${url}${at(node)}`);
              }
            } else if (!STATIC_ROUTES.has(pathname)) {
              errors.push(`link to unknown page: ${url}${at(node)}`);
            }
          }
          break;
        }
        case 'text': {
          const inCode = ancestors.some((ancestor) => ancestor.type === 'inlineCode' || ancestor.type === 'code');
          if (inCode) break;
          if (node.value.includes('"')) {
            warnings.push(`straight double quote in prose (use „…“)${at(node)}`);
          }
          const relative = node.value.match(RELATIVE_TIME);
          if (relative) {
            warnings.push(`relative time word "${relative[0]}" (use an absolute date)${at(node)}`);
          }
          break;
        }
        default:
          break;
      }
    });
  }

  const blocking = strict ? [...errors, ...warnings] : errors;
  const informational = strict ? [] : warnings;
  errorCount += blocking.length;
  warningCount += informational.length;

  if (blocking.length === 0 && informational.length === 0) {
    console.log(`ok       ${rel}`);
    continue;
  }
  for (const message of blocking) console.log(`ERROR    ${rel}: ${message}`);
  for (const message of informational) console.log(`warning  ${rel}: ${message}`);
}

console.log(`\n${files.length} file(s), ${errorCount} error(s), ${warningCount} warning(s)`);
process.exit(errorCount > 0 ? 1 : 0);
