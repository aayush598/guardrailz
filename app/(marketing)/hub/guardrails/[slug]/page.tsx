import { GUARDRAILS } from '@/lib/hub/guardrails';
import { ArrowLeft, Eye, Heart, Share2, Tag, Shield, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HubIcon } from '../../icon-map';

export default function GuardrailPage({ params }: { params: { slug: string } }) {
  const guardrail = GUARDRAILS.find(g => g.slug === params.slug);
  if (!guardrail) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-xl bg-white/95">
        <div className="container mx-auto px-4 py-4">
          <Link href="/hub">
            <Button variant="ghost" size="sm" className="group">
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Hub
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
            
            <div className="relative flex items-start gap-6">
              <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20 shadow-2xl">
                <HubIcon
                  name={guardrail.icon}
                  className="h-16 w-16 text-white"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Badge 
                    className={`
                      px-3 py-1 text-xs font-semibold
                      ${guardrail.stage === 'completed'
                        ? 'bg-green-500/20 text-green-300 border-green-400/30'
                        : guardrail.stage === 'development'
                        ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
                        : 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                      }
                    `}
                  >
                    {guardrail.stage}
                  </Badge>
                </div>
                
                <h1 className="text-4xl font-bold text-white mb-3">
                  {guardrail.name}
                </h1>
                
                <p className="text-lg text-slate-200 max-w-2xl leading-relaxed">
                  {guardrail.description}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="border-b border-slate-200 bg-slate-50/50">
            <div className="grid grid-cols-3 divide-x divide-slate-200">
              <div className="px-6 py-5 text-center">
                <div className="flex items-center justify-center gap-2 text-slate-600 mb-1">
                  <Eye className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Views</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {guardrail.stats.views.toLocaleString()}
                </div>
              </div>
              
              <div className="px-6 py-5 text-center">
                <div className="flex items-center justify-center gap-2 text-slate-600 mb-1">
                  <Heart className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Likes</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {guardrail.stats.likes.toLocaleString()}
                </div>
              </div>
              
              <div className="px-6 py-5 text-center">
                <div className="flex items-center justify-center gap-2 text-slate-600 mb-1">
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
              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-5 w-5 text-slate-600" />
                <h2 className="text-lg font-semibold text-slate-900">Tags</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {guardrail.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-slate-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-200">
              <Button className="bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white shadow-lg">
                <Shield className="h-4 w-4 mr-2" />
                Use This Guardrail
              </Button>
              <Button variant="outline" className="border-slate-300 hover:bg-slate-50">
                <Heart className="h-4 w-4 mr-2" />
                Save to Favorites
              </Button>
              <Button variant="outline" className="border-slate-300 hover:bg-slate-50">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-slate-100 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-slate-700" />
              </div>
              <h3 className="font-semibold text-slate-900">Performance</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Sub-100ms validation with parallel processing. Optimized for production workloads.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-slate-100 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-slate-700" />
              </div>
              <h3 className="font-semibold text-slate-900">Usage</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Trusted by thousands of developers. Active in production environments worldwide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}