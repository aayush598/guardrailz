import { notFound } from 'next/navigation';
import { loadDoc } from '../_utils/load-doc';

export default async function DocsSlugPage({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.join('/');
  const content = await loadDoc(slug);

  if (!content) notFound();

  return <article className="prose prose-neutral max-w-none dark:prose-invert">{content}</article>;
}
