import { Star, Quote } from 'lucide-react';
import Reveal from './Reveal';

const logos = ['Nimbus', 'Quantia', 'Helix', 'Aurora', 'Fathom', 'Beacon'];

const testimonials = [
  {
    quote:
      'Guardrailz completely transformed how we handle sensitive data in our AI apps. The parallel processing is genuinely fast — our p95 latency barely moved.',
    author: 'Sarah Johnson',
    role: 'CTO, Nimbus',
    initials: 'SJ',
  },
  {
    quote:
      'The pre-built profiles saved us weeks. Healthcare compliance is now seamless with their HIPAA-ready guardrails, and our security review sailed through.',
    author: 'Dr. Michael Chen',
    role: 'Lead Engineer, Helix Health',
    initials: 'MC',
  },
  {
    quote:
      'Best-in-class docs and support. We shipped the integration in under an hour and it has been rock solid in production ever since.',
    author: 'Emily Rodriguez',
    role: 'Senior Developer, Quantia',
    initials: 'ER',
  },
];

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden border-t border-neutral-800 bg-neutral-950 py-24 lg:py-32">
      <div className="bg-glow-dark-top pointer-events-none absolute inset-0" />
      <div className="bg-grid-dark pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-neutral-300">
            <Star className="h-4 w-4 fill-brand-400 text-brand-400" />
            Loved by developers
          </span>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Teams that ship with confidence
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-neutral-400">
            Security teams love the coverage. Engineers love the latency.
          </p>
        </Reveal>

        {/* Static logo row */}
        <Reveal className="mb-14" delay={0.1}>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 border-y border-white/10 py-6">
            {logos.map((logo) => (
              <span key={logo} className="text-base font-semibold tracking-tight text-neutral-500">
                {logo}
              </span>
            ))}
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.author} delay={i * 0.08}>
              <figure className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-7">
                <Quote className="h-7 w-7 text-neutral-600" />
                <div className="mt-4 flex gap-1">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 leading-relaxed text-neutral-200">
                  &quot;{t.quote}&quot;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-700 text-sm font-semibold text-white">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t.author}</div>
                    <div className="text-sm text-neutral-400">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
