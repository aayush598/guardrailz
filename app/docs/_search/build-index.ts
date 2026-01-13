// app/docs/_search/build-index.ts
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import MiniSearch from 'minisearch';
import { DocsSearchDocument } from './types';

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, 'app/docs/_content');
const OUTPUT = path.join(ROOT, '/public/docs/_search/search-index.json');

function walk(dir: string): string[] {
  return fs.readdirSync(dir).flatMap((file) => {
    const full = path.join(dir, file);
    return fs.statSync(full).isDirectory() ? walk(full) : [full];
  });
}

function buildDocsSearchIndex() {
  const files = walk(CONTENT_ROOT).filter((f) => f.endsWith('.mdx'));

  const documents: DocsSearchDocument[] = files.map((file) => {
    const slug = path
      .relative(CONTENT_ROOT, file)
      .replace(/\.mdx$/, '')
      .replace(/\\/g, '/');

    const raw = fs.readFileSync(file, 'utf8');
    const { data, content } = matter(raw);

    return {
      id: slug,
      slug,
      title: data.title ?? slug.split('/').pop() ?? slug,
      section: slug.split('/')[0],
      content,
    };
  });

  const miniSearch = new MiniSearch<DocsSearchDocument>({
    fields: ['title', 'content'],
    storeFields: ['title', 'slug', 'section'],
  });

  miniSearch.addAll(documents);

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(miniSearch.toJSON()));

  console.log(`✅ Docs search index built (${documents.length} pages)`);
}

buildDocsSearchIndex();
