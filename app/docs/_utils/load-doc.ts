import path from 'path';
import { promises as fs } from 'fs';
import { compileMDX } from 'next-mdx-remote/rsc';
import { ReactNode } from 'react';

import { Callout } from '../_components/Callout';
import { DocsCodeBlock } from '../_components/DocsCodeBlock';

const CONTENT_ROOT = path.join(process.cwd(), 'app/docs/_content');

/**
 * MDX component mappings
 * MUST be declared as components, not inline lambdas
 */
const mdxComponents = {
  Callout,
  pre: DocsCodeBlock,
};

export async function loadDoc(slug: string): Promise<ReactNode | null> {
  const fullPath = path.join(CONTENT_ROOT, `${slug}.mdx`);

  try {
    const source = await fs.readFile(fullPath, 'utf8');

    const { content } = await compileMDX({
      source,
      components: mdxComponents,
      options: { parseFrontmatter: true },
    });

    return content;
  } catch (err) {
    console.error('Failed to load doc:', err);
    return null;
  }
}
