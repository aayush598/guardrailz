import { Key, Code, BarChart3 } from 'lucide-react';
import Reveal from './Reveal';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      icon: Key,
      title: 'Generate an API key',
      desc: 'Sign up and create your API key instantly. No credit card required for our free tier.',
    },
    {
      step: '02',
      icon: Code,
      title: 'Integrate the SDK',
      desc: 'Add our lightweight SDK to your app with just 3 lines of code. Works with every major framework.',
    },
    {
      step: '03',
      icon: BarChart3,
      title: 'Monitor and scale',
      desc: 'Track latency and token usage in real time. Scale your guardrails as traffic grows.',
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden border-t border-neutral-100 bg-white py-24 lg:py-32"
    >
      <div className="bg-glow-left pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-neutral-200 to-transparent lg:block" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm font-medium text-neutral-600">
            <Code className="h-4 w-4 text-brand-600" />
            Developer friendly
          </span>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            Live in under 10 minutes
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-neutral-600">
            Three steps between you and production-grade AI safety.
          </p>
        </Reveal>

        <div className="relative mx-auto grid max-w-5xl gap-12 md:grid-cols-3 md:gap-8">
          {/* Connecting line */}
          <div
            className="absolute left-0 right-0 top-[44px] hidden h-px bg-neutral-200 md:block"
            aria-hidden="true"
          />

          {steps.map((item, i) => (
            <Reveal key={item.step} delay={i * 0.1}>
              <div className="group relative flex flex-col items-center text-center">
                <div className="relative mb-8">
                  <div className="ease-smooth flex h-[88px] w-[88px] items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                    <item.icon className="h-8 w-8 text-brand-600" />
                  </div>
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 rounded-full bg-neutral-900 px-3 py-0.5 text-xs font-semibold text-white">
                    {item.step}
                  </div>
                </div>

                <h3 className="text-lg font-semibold tracking-tight text-neutral-900">
                  {item.title}
                </h3>
                <p className="mt-2.5 max-w-xs text-base leading-relaxed text-neutral-500">
                  {item.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
