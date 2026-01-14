import { ReactNode } from 'react';
import { DocsSidebar } from './_components/DocsSidebar';
import { DocsBreadcrumb } from './_components/DocsBreadcrumb';
import { docsMetadata } from './_config/metadata';
import { DocsSearch } from './_components/DocSearch';
import { DocsSearchProvider } from './_search/use-docs-search';
import { Navbar } from '@/shared/ui/navbar';

export const metadata = docsMetadata;

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <DocsSearchProvider>
      <div className="flex min-h-screen flex-col">
        {/* Top navbar */}
        <Navbar />

        {/* Docs body */}
        <div className="flex flex-1">
          {/* Docs search overlay */}
          <DocsSearch />

          {/* Sidebar - Fixed position */}
          <aside className="fixed left-0 top-[73px] h-[calc(100vh-73px)] w-64 shrink-0 overflow-y-auto border-r border-border bg-white">
            <DocsSidebar />
          </aside>

          {/* Main content - with left margin to account for fixed sidebar */}
          <main className="ml-64 flex-1 overflow-y-auto px-8 py-6">
            <div className="mx-auto max-w-4xl">
              <DocsBreadcrumb />
              {children}
            </div>
          </main>
        </div>
      </div>
    </DocsSearchProvider>
  );
}
