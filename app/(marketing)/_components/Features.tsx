import { Shield, Zap, CheckCircle2, ScanSearch, Filter } from 'lucide-react';
import Reveal from './Reveal';

export default function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden border-t border-neutral-100 bg-white py-24 lg:py-32"
    >
      <div className="bg-glow-top pointer-events-none absolute inset-0" />
      <div className="bg-grid-faint pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_0%,black,transparent)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm font-medium text-neutral-600">
            <Shield className="h-4 w-4 text-brand-600" />
            Built for production
          </span>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            Security that runs with your app, not against it
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-neutral-600">
            Every guardrail is a check your input and output pass through — in parallel, at the
            speed your users expect.
          </p>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-6">
          {/* Input Validation — large */}
          <Reveal className="lg:col-span-4" delay={0.05}>
            <div className="ease-smooth flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-8 transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-lg hover:shadow-neutral-900/5">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600/10">
                <ScanSearch className="h-6 w-6 text-brand-700" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-neutral-900">
                Input Validation
              </h3>
              <p className="mt-3 max-w-md leading-relaxed text-neutral-600">
                Catch secrets, PII, and malicious patterns before they ever reach your model.
                Configurable sensitivity, zero code changes.
              </p>

              <div className="mt-8 rounded-xl border border-neutral-800 bg-neutral-950 p-5">
                <div className="mb-3 flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-neutral-700" />
                  <span className="h-2 w-2 rounded-full bg-neutral-700" />
                  <span className="h-2 w-2 rounded-full bg-neutral-700" />
                </div>
                <pre className="font-mono text-xs leading-relaxed text-neutral-400">
                  <code>
                    <span className="text-brand-300">await</span> client.validate({'{\n'}
                    &nbsp;&nbsp;text:{' '}
                    <span className="text-red-300">
                      &apos;wire 4,172 to account 1234-5678&apos;
                    </span>
                    ,{'\n'}
                    &nbsp;&nbsp;profile:{' '}
                    <span className="text-emerald-300">&apos;financial&apos;</span>
                    {'\n}'});
                    {'\n\n'}
                    <span className="text-neutral-500">{'// Result'}</span>
                    {'\n'}
                    <span className="text-red-300">PII_FOUND</span> · card · pan · swift{'\n'}
                    <span className="text-emerald-300">BLOCKED</span> · reasons: [
                    <span className="text-red-300">financial</span>]
                  </code>
                </pre>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {['PII Detection', 'Secret Scanning', 'Prompt Injection Defense'].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-600"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-brand-600" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Output Sanitization — small */}
          <Reveal className="lg:col-span-2" delay={0.15}>
            <div className="ease-smooth flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-8 transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-lg hover:shadow-neutral-900/5">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600/10">
                <Filter className="h-6 w-6 text-brand-700" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-neutral-900">
                Output Sanitization
              </h3>
              <p className="mt-3 leading-relaxed text-neutral-600">
                Redact sensitive data from responses before they reach users or downstream systems.
              </p>

              <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-neutral-400">
                  Model output
                </div>
                <p className="text-sm leading-relaxed text-neutral-600">
                  Your order will ship to{' '}
                  <span className="rounded bg-brand-600/10 px-1 font-mono text-brand-700">
                    [address]
                  </span>
                  , contact{' '}
                  <span className="rounded bg-brand-600/10 px-1 font-mono text-brand-700">
                    [email]
                  </span>
                  .
                </p>
              </div>

              <div className="mt-6 space-y-2.5">
                {['PII Redaction', 'Leak Prevention', 'Schema Validation'].map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-2 text-sm font-medium text-neutral-700"
                  >
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-brand-600" />
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Parallel Processing — full width, ink panel */}
          <Reveal className="lg:col-span-6" delay={0.1}>
            <div className="relative overflow-hidden rounded-2xl bg-neutral-950 p-8 lg:p-10">
              <div className="bg-grid-dark pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_right,black,transparent)]" />
              <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
                <div>
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-white/5">
                    <Zap className="h-5 w-5 text-brand-300" />
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight text-white lg:text-2xl">
                    Parallel Processing
                  </h3>
                  <p className="mt-3 max-w-lg leading-relaxed text-neutral-400">
                    Execute every guardrail simultaneously, not in sequence. Built for high
                    throughput with automatic load balancing and auto-scaling — so latency stays
                    flat no matter how many checks you run.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { v: '50+', l: 'Concurrent checks' },
                    { v: '100ms', l: 'Hard ceiling' },
                    { v: '∞', l: 'Auto-scaling' },
                  ].map((stat) => (
                    <div
                      key={stat.l}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-6 text-center"
                    >
                      <div className="text-2xl font-semibold tracking-tight text-white lg:text-3xl">
                        {stat.v}
                      </div>
                      <div className="mt-1 text-xs font-medium text-neutral-400">{stat.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
