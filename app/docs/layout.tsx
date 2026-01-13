import { ReactNode } from 'react';
import { DocsSidebar } from './_components/DocsSidebar';
import { DocsBreadcrumb } from './_components/DocsBreadcrumb';
import { docsMetadata } from './_config/metadata';
import { DocsSearch } from './_components/DocSearch';
import { DocsSearchProvider } from './_search/use-docs-search';

export const metadata = docsMetadata;

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <DocsSearchProvider>
      <div className="flex min-h-screen">
        {/* Docs search */}
        <DocsSearch />

        {/* Sidebar */}
        <DocsSidebar />

        {/* Main content */}
        <main className="max-w-4xl flex-1 px-8 py-6">
          <DocsBreadcrumb />
          {children}
        </main>
      </div>
    </DocsSearchProvider>
  );
}
