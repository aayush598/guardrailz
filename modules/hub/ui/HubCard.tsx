import Link from 'next/link';
import { HubItem } from '../domain/hub-item';
import { Badge } from '@/shared/ui/badge';
import { HubIcon } from '@/app/(marketing)/hub/icon-map';

export function HubCard({ item }: { item: HubItem }) {
  return (
    <Link
      href={`/hub/${item.type}s/${item.slug}`}
      className="group block rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 transition-colors group-hover:from-blue-100 group-hover:to-indigo-100">
          <HubIcon name={item.icon} />
        </div>
        <Badge
          className={`text-xs font-medium ${
            item.type === 'guardrail'
              ? 'bg-purple-50 text-purple-700 hover:bg-purple-100'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          }`}
        >
          {item.type}
        </Badge>
      </div>

      <h3 className="mb-2 text-base font-semibold leading-snug text-slate-900 transition-colors group-hover:text-blue-600">
        {item.name}
      </h3>
      <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">{item.description}</p>

      <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          {item.stats.views}
        </span>
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          {item.stats.likes}
        </span>
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          {item.stats.shares}
        </span>
      </div>
    </Link>
  );
}
