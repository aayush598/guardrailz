import { notFound } from 'next/navigation';
import { loadDoc } from '../_utils/load-doc';

export default async function DocsSlugPage({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.join('/');
  const content = await loadDoc(slug);

  if (!content) notFound();

  return (
    <article className="prose prose-lg prose-neutral max-w-none pb-16 pt-4 dark:prose-invert prose-headings:scroll-mt-20 prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h2:mt-12 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2 prose-h2:text-3xl prose-h3:text-2xl prose-p:text-gray-600 prose-a:font-medium prose-a:text-gray-700 prose-a:no-underline hover:prose-a:text-gray-900 hover:prose-a:underline prose-code:rounded prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm prose-code:font-normal prose-code:text-gray-800 prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:bg-gray-900 prose-pre:shadow-lg">
      {content}
    </article>
  );
}
