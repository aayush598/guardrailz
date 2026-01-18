import Link from 'next/link';
import { BLOG_POSTS } from './data';
import { Clock } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';

export default function BlogListingPage() {
  const [featuredPost, ...recentPosts] = BLOG_POSTS;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white py-24">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <Badge variant="outline" className="mb-6 border-blue-200 bg-blue-50 text-blue-700">
            Our Latest Thinking
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            Insights on AI Security
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Deep dives into LLM guardrails, agentic security, and the future of safe artificial
            intelligence.
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-4 py-16">
        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16">
            <h2 className="mb-8 text-2xl font-bold tracking-tight text-slate-900">
              Featured Article
            </h2>
            <Link
              href={`/blogs/${featuredPost.slug}`}
              className="group relative grid gap-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 transition-all hover:shadow-2xl hover:shadow-slate-200/60 lg:grid-cols-2"
            >
              <div
                className="relative h-64 w-full overflow-hidden bg-slate-100 lg:h-full"
                style={{ background: featuredPost.coverImage }}
              >
                <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/0" />
              </div>
              <div className="flex flex-col justify-center p-8 lg:p-12">
                <div className="mb-6 flex gap-2">
                  {featuredPost.tags.map((tag) => (
                    <Badge key={tag} className="bg-slate-900 text-white hover:bg-slate-800">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h3 className="mb-4 text-3xl font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                  {featuredPost.title}
                </h3>
                <p className="mb-6 text-lg leading-relaxed text-slate-600">
                  {featuredPost.excerpt}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                      <img
                        src={featuredPost.author.avatar}
                        alt={featuredPost.author.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {featuredPost.author.name}
                      </div>
                      <div className="text-xs text-slate-500">{featuredPost.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <Clock className="h-4 w-4" />
                    {featuredPost.readingTime}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Recent Posts Grid */}
        <div>
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-slate-900">Recent Articles</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blogs/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50"
              >
                <div className="h-48 w-full bg-slate-100" style={{ background: post.coverImage }} />
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-4 flex gap-2">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-slate-50 text-slate-600 hover:bg-slate-100"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                    {post.title}
                  </h3>
                  <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-slate-500">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="font-medium">{post.author.name}</span>
                    </div>
                    <span className="text-xs text-slate-400">{post.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter / CTA */}
        <div className="mt-24 rounded-3xl bg-slate-900 px-6 py-16 text-center sm:px-12">
          <h3 className="mb-4 text-3xl font-bold text-white">Stay Updated</h3>
          <p className="mx-auto mb-8 max-w-2xl text-slate-400">
            Get the latest security insights detailed directly to your inbox. No spam, just
            technical deep dives.
          </p>
          <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-lg border-0 bg-white/10 px-4 py-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500"
            />
            <Button className="bg-white text-slate-900 hover:bg-slate-100">Subscribe</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
