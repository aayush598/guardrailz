// app/docs/_search/search-client.ts
import MiniSearch from 'minisearch';
import { DocsSearchDocument } from './types';

let cached: MiniSearch<DocsSearchDocument> | null = null;

export async function createDocsSearch() {
  if (cached) return cached;

  const res = await fetch('/docs/_search/search-index.json');
  const json = await res.text();

  cached = MiniSearch.loadJSON<DocsSearchDocument>(json, {
    fields: ['title', 'content'],
    storeFields: ['title', 'slug', 'section'],
  });

  return cached;
}
