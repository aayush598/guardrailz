import { HubSortKey } from '../domain/hub-sort';

export function HubTopbar({
  query,
  sortBy,
  filterType,
  onQueryChange,
  onSortChange,
  onFilterTypeChange,
}: {
  query: string;
  sortBy: HubSortKey;
  filterType: 'all' | 'guardrail' | 'profile';
  onQueryChange: (v: string) => void;
  onSortChange: (v: HubSortKey) => void;
  onFilterTypeChange: (v: 'all' | 'guardrail' | 'profile') => void;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Type Filter Tabs */}
      <div className="flex items-center space-x-1 rounded-lg bg-slate-100 p-1">
        {(['all', 'guardrail', 'profile'] as const).map((type) => (
          <button
            key={type}
            onClick={() => onFilterTypeChange(type)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              filterType === type
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}s
          </button>
        ))}
      </div>

      <div className="flex flex-1 gap-4 sm:flex-none">
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search..."
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-64 sm:flex-none"
        />

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as HubSortKey)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="views">Most Views</option>
          <option value="likes">Most Likes</option>
          <option value="shares">Most Shares</option>
          <option value="name">Name</option>
        </select>
      </div>
    </div>
  );
}
