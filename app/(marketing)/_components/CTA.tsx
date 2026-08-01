import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import Reveal from './Reveal';

export default function CTA() {
  return (
    <section className="bg-white pb-24 lg:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
            <div className="bg-grid-dark pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_75%_80%_at_50%_0%,black,transparent)]" />
            <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[720px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -right-24 h-80 w-80 rounded-full bg-brand-400/20 blur-3xl" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            <div className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white">
                  <Sparkles className="h-4 w-4" />
                  Join 10,000+ developers
                </span>

                <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
                  Ready to ship AI you can trust?
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-brand-100">
                  Protect your LLM applications with intelligent guardrails in minutes. No credit
                  card required — just paste an API key and go.
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="ease-smooth group h-auto w-full rounded-lg bg-white px-9 py-3.5 text-base font-semibold text-brand-800 shadow-lg shadow-brand-950/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-50 hover:shadow-xl sm:w-auto"
                    >
                      Start building now
                      <ArrowRight className="ease-smooth ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button
                      size="lg"
                      className="ease-smooth h-auto w-full rounded-lg border border-white/30 bg-white/5 px-9 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 sm:w-auto"
                    >
                      View pricing
                    </Button>
                  </Link>
                </div>

                <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-brand-200">
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-brand-300" />
                    No credit card
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-brand-300" />
                    Free forever tier
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-brand-300" />
                    Deploy in minutes
                  </span>
                </p>
              </div>

              <div className="relative mx-auto w-full max-w-md">
                <div className="overflow-hidden rounded-2xl border border-white/15 bg-neutral-950/95 shadow-2xl shadow-brand-950/50">
                  <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                    <span className="h-3 w-3 rounded-full bg-white/15" />
                    <span className="h-3 w-3 rounded-full bg-white/15" />
                    <span className="h-3 w-3 rounded-full bg-white/15" />
                    <span className="ml-3 font-mono text-xs text-neutral-500">quickstart</span>
                    <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-brand-500/20 px-2.5 py-0.5 text-[11px] font-medium text-brand-200">
                      <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-brand-300" />
                      live
                    </span>
                  </div>
                  <div className="p-5 font-mono text-[13px] leading-7 text-neutral-300">
                    <p>
                      <span className="text-brand-300">$</span> npm i{' '}
                      <span className="text-amber-300">@guardrailz/sdk</span>
                    </p>
                    <p className="text-neutral-600"># ~41ms later</p>
                    <p>
                      <span className="text-brand-300">const</span>{' '}
                      <span className="text-sky-300">gz</span> ={' '}
                      <span className="text-brand-300">new</span>{' '}
                      <span className="text-emerald-300">Guardrailz</span>
                      <span className="text-neutral-400">(</span>
                      <span className="text-amber-300">&apos;grd_live_•••&apos;</span>
                      <span className="text-neutral-400">)</span>
                    </p>
                    <p>
                      <span className="text-brand-300">const</span> res ={' '}
                      <span className="text-brand-300">await</span> gz.
                      <span className="text-sky-300">validate</span>
                      <span className="text-neutral-400">({'{'} text, profile:</span>{' '}
                      <span className="text-amber-300">&apos;default&apos;</span>
                      <span className="text-neutral-400">{'}'})</span>
                    </p>
                    <p className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3 text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" />
                      PII blocked · prompt approved
                      <span className="animate-blink ml-auto inline-block h-4 w-2 bg-emerald-300/80" />
                    </p>
                  </div>
                </div>

                <div className="animate-float absolute -bottom-6 -right-3 flex items-center gap-2 rounded-xl border border-white/20 bg-white/95 px-3.5 py-2.5 shadow-xl shadow-brand-950/30 sm:-right-8">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-neutral-900">Guardrail active</div>
                    <div className="text-xs text-neutral-500">41ms · profile: default</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
