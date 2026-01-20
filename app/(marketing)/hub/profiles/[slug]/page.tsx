import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PROFILES, guardrailCatalog } from '@/modules/hub/data';
import {
  Heart,
  Shield,
  ArrowLeft,
  CheckCircle2,
  Package,
  Terminal,
  Copy,
  LayoutGrid,
  Zap,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { compileMDX } from 'next-mdx-remote/rsc';
import { Separator } from '@/shared/ui/separator';
import { HubIcon } from '../../icon-map';
import { HubShareButton } from '@/shared/ui/share-buttons';

const STAGE_CONFIG = {
  completed: {
    label: 'Production Ready',
    className: 'border-green-200 text-green-700',
    dotClassName: 'bg-green-500',
  },
  development: {
    label: 'Beta / Experimental',
    className: 'border-yellow-200 text-yellow-700',
    dotClassName: 'bg-yellow-500',
  },
  maintenance: {
    label: 'Maintenance Mode',
    className: 'border-orange-200 text-orange-700',
    dotClassName: 'bg-orange-500',
  },
};

export default async function ProfileDetailPage({ params }: { params: { slug: string } }) {
  const profile = PROFILES.find((p) => p.slug === params.slug);

  if (!profile) {
    notFound();
  }

  let fullDescriptionContent = null;
  if (profile.fullDescription) {
    const { content } = await compileMDX({
      source: profile.fullDescription,
      options: { parseFrontmatter: false },
    });
    fullDescriptionContent = content;
  }

  const guardrails = profile.guardrails
    .map((id) => guardrailCatalog.find((g) => g.id === id))
    .filter(Boolean);

  const stageInfo =
    STAGE_CONFIG[profile.stage as keyof typeof STAGE_CONFIG] || STAGE_CONFIG.development;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Navbar / Breadcrumb Placeholder */}
      <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-md">
        <div className="container mx-auto flex max-w-7xl items-center gap-2 text-sm text-slate-500">
          <Link href="/hub" className="flex items-center transition-colors hover:text-slate-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Hub
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-medium text-slate-900">Profiles</span>
          <span className="text-slate-300">/</span>
          <span className="truncate text-slate-900">{profile.name}</span>
        </div>
      </div>

      <main className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* LEFT COLUMN: Sticky Sidebar (Profile Info) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Profile Main Card */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
                <div className="relative h-32 bg-gradient-to-b from-slate-50 to-white p-6">
                  <div className="absolute right-4 top-4 opacity-5">
                    <HubIcon name={profile.icon} className="h-48 w-48 rotate-12" />
                  </div>
                  <Badge
                    variant="outline"
                    className={`bg-white/50 backdrop-blur-sm ${stageInfo.className}`}
                  >
                    <div className={`mr-1.5 h-1.5 w-1.5 rounded-full ${stageInfo.dotClassName}`} />
                    {stageInfo.label}
                  </Badge>
                </div>

                <div className="px-6 pb-6">
                  <div className="relative z-10 -mt-12 mb-5 inline-flex rounded-2xl border-4 border-white bg-slate-900 p-4 shadow-xl">
                    <HubIcon name={profile.icon} className="h-10 w-10 text-white" />
                  </div>

                  <h1 className="mb-2 text-2xl font-bold tracking-tight text-slate-900">
                    {profile.name}
                  </h1>
                  <p className="mb-6 text-sm leading-relaxed text-slate-500">
                    {profile.description}
                  </p>

                  <div className="mb-6 flex flex-wrap gap-2">
                    {profile.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-medium text-slate-600 hover:bg-slate-200"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button className="w-full bg-slate-900 hover:bg-slate-800">
                      <LayoutGrid className="mr-2 h-4 w-4" />
                      Use This Profile
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="w-full justify-center">
                        <Heart className="mr-2 h-4 w-4" /> Like
                      </Button>
                      <HubShareButton className="w-full justify-center" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-3 divide-x divide-slate-100 bg-slate-50/50 py-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-slate-900">
                      {profile.stats.views > 1000
                        ? (profile.stats.views / 1000).toFixed(1) + 'k'
                        : profile.stats.views}
                    </div>
                    <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                      Views
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-slate-900">
                      {profile.stats.likes}
                    </div>
                    <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                      Likes
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-slate-900">
                      {profile.stats.shares}
                    </div>
                    <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                      Used
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links / TOC could go here if needed */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 font-semibold text-slate-900">Contributors</h3>
                <div className="flex -space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-100 text-xs font-bold text-blue-600">
                    GD
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-purple-100 text-xs font-bold text-purple-600">
                    AI
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Scrolable Content */}
          <div className="space-y-12 lg:col-span-8">
            {/* 1. Full Description */}
            {profile.fullDescription && fullDescriptionContent ? (
              <section className="prose prose-slate max-w-none prose-headings:font-semibold prose-a:text-blue-600 hover:prose-a:text-blue-500">
                <h2 className="flex items-center text-2xl font-bold tracking-tight text-slate-900">
                  <BookOpen className="mr-3 h-6 w-6 text-slate-400" />
                  Overview
                </h2>
                <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200/60">
                  <div className="text-base leading-7 text-slate-600">{fullDescriptionContent}</div>
                </div>
              </section>
            ) : null}

            {/* 2. Guardrails Grid */}
            <section>
              <div className="mb-6 flex items-baseline justify-between">
                <h2 className="flex items-center text-2xl font-bold tracking-tight text-slate-900">
                  <Shield className="mr-3 h-6 w-6 text-slate-400" />
                  Included Guardrails
                </h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                  {guardrails.length} Rules
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {guardrails.map((g) => (
                  <Link
                    key={g!.id}
                    href={`/hub/guardrails/${g!.slug}`}
                    className="group relative flex flex-col rounded-xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
                        <HubIcon name={g!.icon} className="h-5 w-5" />
                      </div>
                      <Badge variant="secondary" className="bg-slate-50 text-slate-500">
                        v1.0
                      </Badge>
                    </div>
                    <h3 className="mb-1 font-semibold text-slate-900">{g!.name}</h3>
                    <p className="line-clamp-2 text-sm text-slate-500">{g!.description}</p>
                  </Link>
                ))}
              </div>
            </section>

            {/* 3. Benefits Grid */}
            {profile.benefits && (
              <section>
                <h2 className="mb-6 flex items-center text-2xl font-bold tracking-tight text-slate-900">
                  <Zap className="mr-3 h-6 w-6 text-slate-400" />
                  Key Benefits
                </h2>
                <div className="grid gap-6 md:grid-cols-3">
                  {profile.benefits.map((benefit, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition-all hover:bg-slate-50"
                    >
                      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                        <HubIcon name={benefit.icon || 'check'} className="h-5 w-5" />
                      </div>
                      <h3 className="mb-2 font-semibold text-slate-900">{benefit.title}</h3>
                      <p className="text-sm leading-relaxed text-slate-500">
                        {benefit.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. Use Cases (List Style) */}
            {profile.useCases && (
              <section>
                <h2 className="mb-6 flex items-center text-2xl font-bold tracking-tight text-slate-900">
                  <Package className="mr-3 h-6 w-6 text-slate-400" />
                  Wait, when should I use this?
                </h2>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <div className="divide-y divide-slate-100">
                    {profile.useCases.map((useCase, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-5 transition-colors hover:bg-slate-50"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-slate-700">{useCase}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 5. Implementation Code */}
            {profile.implementation && (
              <section>
                <div className="mb-6 flex items-end justify-between">
                  <h2 className="flex items-center text-2xl font-bold tracking-tight text-slate-900">
                    <Terminal className="mr-3 h-6 w-6 text-slate-400" />
                    Integration
                  </h2>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="border-slate-200 bg-white font-mono">
                      {profile.implementation.language}
                    </Badge>
                  </div>
                </div>

                <div className="group relative overflow-hidden rounded-xl border border-slate-800 bg-[#0F172A] shadow-2xl">
                  {/* Mac-style Window Header */}
                  <div className="flex items-center justify-between border-b border-slate-700/50 bg-slate-800/50 px-4 py-3 backdrop-blur">
                    <div className="flex gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500/80" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                      <div className="h-3 w-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="text-xs font-medium text-slate-400">
                      config.{profile.implementation.language}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-slate-400 hover:text-white"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {/* Code Area */}
                  <div className="overflow-x-auto p-6">
                    <pre className="font-mono text-sm leading-relaxed text-slate-300">
                      <code>{profile.implementation.code}</code>
                    </pre>
                  </div>
                </div>
              </section>
            )}

            {/* 6. FAQ Accordion Style */}
            {profile.faq && (
              <section className="border-t border-slate-200 pt-12">
                <h2 className="mb-8 text-center text-2xl font-bold tracking-tight text-slate-900">
                  Frequently Asked Questions
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {profile.faq.map((item, i) => (
                    <div
                      key={i}
                      className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                    >
                      <h4 className="mb-3 font-semibold text-slate-900">{item.question}</h4>
                      <p className="text-sm leading-relaxed text-slate-500">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
