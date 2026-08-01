'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';
import HeroMockup from './HeroMockup';

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v).toLocaleString()),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

const logos = ['Nimbus', 'Quantia', 'Helix', 'Aurora', 'Fathom', 'Beacon'];

export default function Hero() {
  const router = useRouter();

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const lenis = (window as unknown as { lenis?: { scrollTo: (t: string, o?: object) => void } })
        .lenis;
      if (lenis) {
        lenis.scrollTo(href);
      } else {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push(href);
    }
  };

  return (
    <section className="bg-hero-wash relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="bg-glow-bottom pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-28">
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_0.9fr]">
          {/* ---------- Left: copy ---------- */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-neutral-200 bg-white py-1 pl-1.5 pr-4 text-sm text-neutral-600 shadow-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-2.5 py-0.5 text-xs font-medium text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                New
              </span>
              <span>50+ production-ready guardrails</span>
            </div>

            <h1 className="mt-7 text-4xl font-semibold leading-[1.1] tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
              Ship AI you can
              <br />
              actually trust<span className="text-accent">.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-neutral-600 lg:mx-0">
              Guardrailz runs PII detection, secret scanning, and prompt-injection defense in
              parallel — under 100ms, one SDK, zero drift. Secure your LLM apps without slowing them
              down.
            </p>

            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={() => router.push('/dashboard')}
                className="ease-smooth group h-auto w-full rounded-lg bg-neutral-900 px-7 py-3.5 text-base font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-lg hover:shadow-neutral-900/10 sm:w-auto"
              >
                Start building free
                <ArrowRight className="ease-smooth ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('/docs')}
                className="ease-smooth h-auto w-full rounded-lg border-neutral-300 bg-white px-7 py-3.5 text-base font-semibold text-neutral-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-400 hover:bg-neutral-50 hover:shadow-md sm:w-auto"
              >
                Read the docs
              </Button>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex flex-col items-center gap-6 lg:items-start">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {['JD', 'MC', 'ER', 'AK'].map((initials, i) => (
                    <div
                      key={initials}
                      className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-xs font-semibold text-white ${
                        ['bg-neutral-700', 'bg-neutral-500', 'bg-brand-600', 'bg-neutral-900'][i]
                      }`}
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <div className="text-left text-sm leading-tight">
                  <div className="font-semibold text-neutral-900">10,000+ developers</div>
                  <div className="text-neutral-500">shipping safer AI today</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 lg:justify-start">
                <span className="text-xs font-medium uppercase tracking-widest text-neutral-400">
                  Trusted by teams at
                </span>
                {logos.map((logo) => (
                  <span
                    key={logo}
                    className="text-sm font-semibold tracking-tight text-neutral-400"
                  >
                    {logo}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ---------- Right: interactive product mockup ---------- */}
          <HeroMockup />
        </div>

        {/* Stats band */}
        <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 lg:grid-cols-4">
          {[
            { value: <AnimatedNumber value={2943} />, label: 'Guardrail executions' },
            { value: '50+', label: 'Ready-made guardrails' },
            { value: '<100ms', label: 'Parallel latency' },
            { value: '99.9%', label: 'Uptime SLA' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white px-6 py-7 text-center">
              <div className="text-3xl font-semibold tracking-tight text-neutral-900">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-neutral-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
