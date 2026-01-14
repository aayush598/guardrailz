'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { docsNavigation } from '../_config/navigation';
import { useDocsSearch } from '@/app/docs/_search/use-docs-search';
import { Search } from 'lucide-react';

export function DocsSidebar() {
  const pathname = usePathname();
  const { setOpen } = useDocsSearch();

  return (
    <div className="h-full px-4 py-6">
      {/* Search button */}
      <button
        onClick={() => setOpen(true)}
        className="mb-6 flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-100"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search docs...</span>
        <kbd className="rounded bg-white px-2 py-0.5 text-xs font-medium text-gray-500 shadow-sm">
          ⌘K
        </kbd>
      </button>

      {/* Navigation */}
      <nav className="space-y-8">
        {docsNavigation.map((section) => {
          const isActiveSection = section.items.some((item) => pathname === `/docs/${item.slug}`);

          return (
            <div key={section.section}>
              {/* Section title */}
              <h4
                className={clsx(
                  'mb-3 text-xs font-semibold uppercase tracking-wider transition-colors',
                  isActiveSection ? 'text-gray-900' : 'text-gray-500',
                )}
              >
                {section.section}
              </h4>

              {/* Section items */}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const href = `/docs/${item.slug}`;
                  const isActive = pathname === href;

                  return (
                    <li key={item.slug}>
                      <Link
                        href={href}
                        className={clsx(
                          'group relative block rounded-md px-3 py-2 text-sm transition-all',
                          isActive
                            ? 'bg-gray-100 font-medium text-gray-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                        )}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-gray-700" />
                        )}
                        <span className={isActive ? 'ml-1' : ''}>{item.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
