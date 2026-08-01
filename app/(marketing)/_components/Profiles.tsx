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
  ArrowUpRight,
} from 'lucide-react';
import Reveal from './Reveal';

export default function Profiles() {
  const profiles = [
    {
      name: 'Default',
      desc: 'Baseline security and safety guardrails for standard AI interactions',
      icon: ShieldCheck,
      guardrails: 4,
      href: '/hub/profiles/default',
      tile: 'bg-brand-50 text-brand-700',
      chip: 'bg-brand-50 text-brand-700 border-brand-100',
    },
    {
      name: 'Enterprise Security',
      desc: 'Enterprise-grade security with strict controls and tight input limits',
      icon: Building2,
      guardrails: 3,
      href: '/hub/profiles/enterprise-security',
      tile: 'bg-neutral-100 text-neutral-700',
      chip: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    },
    {
      name: 'Child Safety',
      desc: 'Maximum safety and content filtering for children and education',
      icon: Baby,
      guardrails: 3,
      href: '/hub/profiles/child-safety',
      tile: 'bg-rose-50 text-rose-700',
      chip: 'bg-rose-50 text-rose-700 border-rose-100',
    },
    {
      name: 'Healthcare',
      desc: 'HIPAA-aligned guardrails for healthcare and clinical AI systems',
      icon: HeartPulse,
      guardrails: 9,
      href: '/hub/profiles/healthcare-hipaa',
      tile: 'bg-emerald-50 text-emerald-700',
      chip: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    },
    {
      name: 'Financial',
      desc: 'Compliance-focused guardrails for banking, fintech, and payments',
      icon: Landmark,
      guardrails: 10,
      href: '/hub/profiles/financial-services',
      tile: 'bg-amber-50 text-amber-700',
      chip: 'bg-amber-50 text-amber-700 border-amber-100',
    },
    {
      name: 'Minimal',
      desc: 'Lightweight guardrails for development, testing, and experimentation',
      icon: Wrench,
      guardrails: 1,
      href: '/hub/guardrails/gdpr-data-minimization',
      tile: 'bg-neutral-100 text-neutral-700',
      chip: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    },
  ];

  return (
    <section
      id="profiles"
      className="relative overflow-hidden border-t border-neutral-100 bg-neutral-50 py-24 lg:py-32"
    >
      <div className="bg-glow-bottom pointer-events-none absolute inset-0" />
      <div className="bg-dots pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,black,transparent)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm font-medium text-neutral-600">
            <Globe className="h-4 w-4 text-brand-600" />
            Industry solutions
          </span>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            Pre-built profiles, ready in minutes
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-neutral-600">
            Industry-tuned configurations that map to the regulations you actually care about.
          </p>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile, i) => (
            <Reveal key={profile.name} delay={i * 0.05}>
              <Link href={profile.href} className="group block h-full">
                <div className="ease-smooth flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-lg hover:shadow-neutral-900/5">
                  <div className="mb-6 flex items-start justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-lg ${profile.tile}`}
                    >
                      <profile.icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${profile.chip}`}
                    >
                      {profile.guardrails} guardrails
                    </span>
                  </div>

                  <h4 className="text-lg font-semibold tracking-tight text-neutral-900">
                    {profile.name}
                  </h4>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500">
                    {profile.desc}
                  </p>

                  <div className="ease-smooth mt-6 inline-flex items-center text-sm font-medium text-neutral-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-neutral-900">
                    View details
                    <ArrowUpRight className="ease-smooth ml-1 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center" delay={0.1}>
          <Link
            href="/dashboard/profiles"
            className="ease-smooth inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 shadow-sm transition-all duration-300 hover:border-neutral-400 hover:bg-neutral-50"
          >
            Create a custom profile
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
