import Link from 'next/link';
import {
  ShieldCheck,
  Building2,
  Baby,
  HeartPulse,
  Landmark,
  Wrench,
  Globe,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';

export default function Profiles() {
  const profiles = [
    {
      name: 'Default',
      desc: 'Baseline security and safety guardrails for standard AI interactions',
      icon: ShieldCheck,
      guardrails: 4,
      href: '/hub/profiles/default',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'group-hover:border-blue-200',
      iconColor: 'text-blue-600',
    },
    {
      name: 'Enterprise Security',
      desc: 'Enterprise-grade security with strict controls and tight input limits',
      icon: Building2,
      guardrails: 3,
      href: '/hub/profiles/enterprise-security',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'group-hover:border-purple-200',
      iconColor: 'text-purple-600',
    },
    {
      name: 'Child Safety',
      desc: 'Maximum safety and content filtering for children and education',
      icon: Baby,
      guardrails: 3,
      href: '/hub/profiles/child-safety',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-700',
      borderColor: 'group-hover:border-pink-200',
      iconColor: 'text-pink-600',
    },
    {
      name: 'Healthcare',
      desc: 'HIPAA-aligned guardrails for healthcare and clinical AI systems',
      icon: HeartPulse,
      guardrails: 9,
      href: '/hub/profiles/healthcare-hipaa',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'group-hover:border-green-200',
      iconColor: 'text-green-600',
    },
    {
      name: 'Financial',
      desc: 'Compliance-focused guardrails for banking, fintech, and payments',
      icon: Landmark,
      guardrails: 10,
      href: '/hub/profiles/financial-services',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      borderColor: 'group-hover:border-amber-200',
      iconColor: 'text-amber-600',
    },
    {
      name: 'Minimal',
      desc: 'Lightweight guardrails for development, testing, and experimentation',
      icon: Wrench,
      guardrails: 1,
      href: '/hub/guardrails/gdpr-data-minimization',
      bgColor: 'bg-slate-100',
      textColor: 'text-slate-700',
      borderColor: 'group-hover:border-slate-300',
      iconColor: 'text-slate-600',
    },
  ];

  return (
    <section id="profiles" className="relative bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center space-x-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-gray-700">
            <Globe className="h-4 w-4" />
            <span>Industry Solutions</span>
          </div>
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Pre-Built Security Profiles
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Industry-specific configurations ready to deploy in minutes
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => (
            <Link key={profile.name} href={profile.href}>
              <Card
                className={`group h-full cursor-pointer border-gray-200 bg-white transition-all duration-500 hover:-translate-y-2 hover:border-gray-400 hover:shadow-2xl hover:shadow-gray-200/50 ${profile.borderColor} border-2`}
              >
                <CardContent className="p-7">
                  <div className="mb-6 flex items-start justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${profile.bgColor} transition-transform duration-500 group-hover:rotate-3 group-hover:scale-110`}
                    >
                      <profile.icon className={`h-6 w-6 ${profile.iconColor}`} />
                    </div>

                    <div
                      className={`inline-flex items-center rounded-full ${profile.bgColor} px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${profile.textColor}`}
                    >
                      {profile.guardrails} Guardrails
                    </div>
                  </div>

                  <h4 className="mb-3 font-jakarta text-xl font-bold tracking-tight text-gray-900 group-hover:text-gray-800">
                    {profile.name}
                  </h4>

                  <p className="font-inter text-sm leading-relaxed text-gray-500 group-hover:text-gray-600">
                    {profile.desc}
                  </p>

                  <div className="mt-6 flex items-center text-xs font-semibold text-gray-400 transition-colors group-hover:text-gray-900">
                    View Details
                    <ChevronRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/dashboard/profiles">
            <Button
              variant="outline"
              className="border-2 border-gray-600 px-8 py-3 font-semibold text-gray-600 transition-all duration-300 hover:bg-gray-600 hover:text-white"
            >
              Create Custom Profile
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
