'use client';

import { useMemo, useState } from 'react';
import { HUB_CATALOG } from '../data';
import { queryHubItems } from '../service/hub-query.service';
import { computeHubStats } from '../service/hub-stats.service';
import { HubSortKey } from '../domain/hub-sort';
import { HubTag } from '@/modules/hub/domain/hub-tags';

import { HubSidebar } from './HubSidebar';
import { HubTopbar } from './HubTopbar';
import { HubGrid } from './HubGrid';

export function HubClient() {
  const [query, setQuery] = useState('');
  const [tags, setTags] = useState<HubTag[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'guardrail' | 'profile'>('all');
  const [sortBy, setSortBy] = useState<HubSortKey>('views');

  const items = useMemo(
    () => queryHubItems(HUB_CATALOG, { query, tags, type: filterType }, sortBy),
    [query, tags, sortBy, filterType],
  );

  const stats = useMemo(() => computeHubStats(items), [items]);

  return (
    <div className="flex gap-8">
      <HubSidebar
        selectedTags={tags}
        onToggleTag={(tag) =>
          setTags((t) => (t.includes(tag) ? t.filter((x) => x !== tag) : [...t, tag]))
        }
        onClear={() => {
          setQuery('');
          setTags([]);
          setFilterType('all');
        }}
        stats={stats}
      />

      <main className="flex-1 space-y-6">
        <HubTopbar
          query={query}
          sortBy={sortBy}
          filterType={filterType}
          onQueryChange={setQuery}
          onSortChange={setSortBy}
          onFilterTypeChange={setFilterType}
        />

        <HubGrid items={items} />
      </main>
    </div>
  );
}
