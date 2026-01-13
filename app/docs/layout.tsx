import { ReactNode } from 'react';
import { DocsSidebar } from './_components/DocsSidebar';
import { DocsBreadcrumb } from './_components/DocsBreadcrumb';
import { docsMetadata } from './_config/metadata';

export const metadata = docsMetadata;

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <DocsSidebar />

      {/* Main content */}
      <main className="max-w-4xl flex-1 px-8 py-6">
        <DocsBreadcrumb />
        {children}
      </main>
    </div>
  );
}
