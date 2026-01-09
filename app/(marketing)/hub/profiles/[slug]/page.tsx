import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PROFILES } from '@/lib/hub/profiles';
import { GUARDRAILS } from '@/lib/hub/guardrails';
import { Eye, Heart, Share2, Shield, ArrowLeft, CheckCircle, Package, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HubIcon } from '../../icon-map';

export default function ProfileDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const profile = PROFILES.find(p => p.slug === params.slug);

  if (!profile) {
    notFound();
  }

  const guardrails = profile.guardrails
    .map(id => GUARDRAILS.find(g => g.id === id))
    .filter(Boolean);

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

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden mb-8">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32" />
            
            <div className="relative">
              <div className="flex items-start gap-6 mb-6">
                <div className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/20 shadow-2xl">
                  <HubIcon
                    name={profile.icon}
                    className="h-20 w-20 text-white"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge
                      className={`
                        px-3 py-1 text-xs font-semibold
                        ${profile.stage === 'completed'
                          ? 'bg-green-500/20 text-green-300 border-green-400/30'
                          : profile.stage === 'development'
                          ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
                          : 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                        }
                      `}
                    >
                      {profile.stage}
                    </Badge>
                    <Badge className="bg-white/10 text-white border-white/20">
                      Security Profile
                    </Badge>
                  </div>

                  <h1 className="text-4xl font-bold text-white mb-3">
                    {profile.name}
                  </h1>

                  <p className="text-lg text-slate-200 max-w-3xl leading-relaxed">
                    {profile.description}
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {profile.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-white/10 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium border border-white/20"
                  >
                    #{tag}
                  </span>
                ))}
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
                  {profile.stats.views.toLocaleString()}
                </div>
              </div>
              
              <div className="px-6 py-5 text-center">
                <div className="flex items-center justify-center gap-2 text-slate-600 mb-1">
                  <Heart className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Likes</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {profile.stats.likes.toLocaleString()}
                </div>
              </div>
              
              <div className="px-6 py-5 text-center">
                <div className="flex items-center justify-center gap-2 text-slate-600 mb-1">
                  <Share2 className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Shares</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {profile.stats.shares.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 bg-white">
            <div className="flex flex-wrap gap-3">
              <Button className="bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white shadow-lg">
                <CheckCircle className="h-4 w-4 mr-2" />
                Use This Profile
              </Button>
              <Button variant="outline" className="border-slate-300 hover:bg-slate-50">
                <Heart className="h-4 w-4 mr-2" />
                Save to Favorites
              </Button>
              <Button variant="outline" className="border-slate-300 hover:bg-slate-50">
                <Share2 className="h-4 w-4 mr-2" />
                Share Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Included Guardrails Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-slate-900 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Included Guardrails
              </h2>
              <p className="text-sm text-slate-600">
                {guardrails.length} guardrails configured in this profile
              </p>
            </div>
          </div>

          {guardrails.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-12 text-center">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No Guardrails Yet
              </h3>
              <p className="text-slate-600 max-w-md mx-auto">
                No guardrails are finalized for this profile yet. Check back soon for updates.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {guardrails.map(guardrail => (
                <Link
                  key={guardrail!.id}
                  href={`/hub/guardrails/${guardrail!.slug}`}
                  className="group bg-white border border-slate-200 rounded-xl p-6 hover:shadow-xl hover:border-slate-300 transition-all duration-300"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-slate-100 p-3 rounded-xl group-hover:scale-110 transition-transform">
                      <HubIcon
                        name={guardrail!.icon}
                        className="h-10 w-10 text-slate-700"
                      />
                    </div>
                    <Badge
                      className={`
                        text-xs font-semibold
                        ${guardrail!.stage === 'completed'
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : guardrail!.stage === 'development'
                          ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                          : 'bg-blue-100 text-blue-700 border-blue-200'
                        }
                      `}
                    >
                      {guardrail!.stage}
                    </Badge>
                  </div>

                  {/* Content */}
                  <h3 className="font-bold text-lg mb-2 text-slate-900 group-hover:text-slate-700">
                    {guardrail!.name}
                  </h3>

                  <p className="text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed">
                    {guardrail!.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {guardrail!.stats.views.toLocaleString()}
                    </span>
                    <span className="text-slate-400">→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-slate-100 p-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-slate-700" />
              </div>
              <h3 className="font-semibold text-slate-900">Benefits</h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-slate-400 mt-1">•</span>
                <span>Pre-configured security rules for your use case</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-400 mt-1">•</span>
                <span>Battle-tested in production environments</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-400 mt-1">•</span>
                <span>Easy integration with existing applications</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-slate-100 p-2 rounded-lg">
                <Tag className="h-5 w-5 text-slate-700" />
              </div>
              <h3 className="font-semibold text-slate-900">Best For</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              This profile is optimized for applications that require industry-specific
              compliance and security standards. Perfect for production deployments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}