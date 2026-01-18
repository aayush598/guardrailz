import { GUARDRAILS } from '@/modules/hub/data';
import { ArrowLeft, Eye, Heart, Share2, Tag, Shield, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { HubIcon } from '../../icon-map';
import { HubShareButton } from '@/shared/ui/share-buttons';

export default function GuardrailPage({ params }: { params: { slug: string } }) {
  const guardrail = GUARDRAILS.find((g) => g.slug === params.slug);
  if (!guardrail) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white bg-white/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <Link href="/hub">
            <Button variant="ghost" size="sm" className="group">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Hub
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-12">
        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 p-8">
            <div className="absolute right-0 top-0 -mr-32 -mt-32 h-64 w-64 rounded-full bg-white/5" />
            <div className="absolute bottom-0 left-0 -mb-24 -ml-24 h-48 w-48 rounded-full bg-white/5" />

            <div className="relative flex items-start gap-6">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
                <HubIcon name={guardrail.icon} className="h-16 w-16 text-white" />
              </div>

              <div className="flex-1">
                <div className="mb-3 flex items-center gap-3">
                  <Badge
                    className={`px-3 py-1 text-xs font-semibold ${
                      guardrail.stage === 'completed'
                        ? 'border-green-400/30 bg-green-500/20 text-green-300'
                        : guardrail.stage === 'development'
                          ? 'border-yellow-400/30 bg-yellow-500/20 text-yellow-300'
                          : 'border-blue-400/30 bg-blue-500/20 text-blue-300'
                    } `}
                  >
                    {guardrail.stage}
                  </Badge>
                </div>

                <h1 className="mb-3 text-4xl font-bold text-white">{guardrail.name}</h1>

                <p className="max-w-2xl text-lg leading-relaxed text-slate-200">
                  {guardrail.description}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="border-b border-slate-200 bg-slate-50/50">
            <div className="grid grid-cols-3 divide-x divide-slate-200">
              <div className="px-6 py-5 text-center">
                <div className="mb-1 flex items-center justify-center gap-2 text-slate-600">
                  <Eye className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Views</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {guardrail.stats.views.toLocaleString()}
                </div>
              </div>

              <div className="px-6 py-5 text-center">
                <div className="mb-1 flex items-center justify-center gap-2 text-slate-600">
                  <Heart className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Likes</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {guardrail.stats.likes.toLocaleString()}
                </div>
              </div>

              <div className="px-6 py-5 text-center">
                <div className="mb-1 flex items-center justify-center gap-2 text-slate-600">
                  <Share2 className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Shares</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {guardrail.stats.shares.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Tags Section */}
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <Tag className="h-5 w-5 text-slate-600" />
                <h2 className="text-lg font-semibold text-slate-900">Tags</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {guardrail.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">
              <Button className="bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg hover:from-slate-800 hover:to-slate-700">
                <Shield className="mr-2 h-4 w-4" />
                Use This Guardrail
              </Button>
              <Button variant="outline" className="border-slate-300 hover:bg-slate-50">
                <Heart className="mr-2 h-4 w-4" />
                Save to Favorites
              </Button>
              <HubShareButton className="border-slate-300 hover:bg-slate-50" />
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <Clock className="h-5 w-5 text-slate-700" />
              </div>
              <h3 className="font-semibold text-slate-900">Performance</h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              Sub-100ms validation with parallel processing. Optimized for production workloads.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <TrendingUp className="h-5 w-5 text-slate-700" />
              </div>
              <h3 className="font-semibold text-slate-900">Usage</h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              Trusted by thousands of developers. Active in production environments worldwide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
