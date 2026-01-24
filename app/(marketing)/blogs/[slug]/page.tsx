import Link from 'next/link';
import NextImage from 'next/image';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import { BLOG_POSTS } from '../data';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { BlogShareButtons } from '@/shared/ui/share-buttons';

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const { content } = await compileMDX({
    source: post.content,
    options: { parseFrontmatter: false },
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar / Breadcrumb Placeholder */}
      <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-md">
        <div className="container mx-auto flex max-w-7xl items-center gap-2 text-sm text-slate-500">
          <Link href="/blogs" className="flex items-center transition-colors hover:text-slate-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Blog
          </Link>
          <span className="text-slate-300">/</span>
          <span className="truncate font-medium text-slate-900">{post.title}</span>
        </div>
      </div>

      {/* Header / Cover */}
      <div className="relative bg-slate-900 py-20 sm:py-24">
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: post.coverImage, filter: 'blur(100px)' }}
        />
        <div className="absolute inset-0 bg-slate-900/50" />

        <div className="container relative mx-auto max-w-4xl px-4">
          <div className="mb-6 flex gap-2">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="border-white/20 bg-white/10 text-white backdrop-blur-sm"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 border-t border-white/10 pt-8 text-sm text-slate-300">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-800 ring-2 ring-white/10">
                <NextImage
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </div>
              <div>
                <div className="font-semibold text-white">{post.author.name}</div>
                <div className="text-xs text-slate-400">{post.author.role}</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {post.date}
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readingTime}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_200px]">
          {/* Main Article */}
          <article className="prose prose-lg prose-slate max-w-none prose-headings:scroll-mt-20 prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-img:rounded-xl">
            {content}
          </article>

          {/* Sidebar / Share (Desktop) */}
          <div className="hidden space-y-8 lg:block">
            <div className="sticky top-24">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">
                Share this
              </h4>
              <BlogShareButtons title={post.title} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
