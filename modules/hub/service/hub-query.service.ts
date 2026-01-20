import { HubItem } from '../domain/hub-item';
import { HubFilter } from '../domain/hub-filter';
import { HubSortKey } from '../domain/hub-sort';

export function queryHubItems(items: HubItem[], filter: HubFilter, sortBy: HubSortKey): HubItem[] {
  return items
    .filter((item) => {
      const matchesQuery = item.name.toLowerCase().includes(filter.query.toLowerCase());

      const matchesTags =
        filter.tags.length === 0 || filter.tags.every((t) => item.tags.includes(t));

      const matchesType = filter.type === 'all' || item.type === filter.type;

      return matchesQuery && matchesTags && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return b.stats[sortBy] - a.stats[sortBy];
    });
}
