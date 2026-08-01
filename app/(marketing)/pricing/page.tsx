import Link from 'next/link';
import { Check, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { CheckoutButton } from '../_components/CheckoutButton';
import Reveal from '../_components/Reveal';

export const metadata = {
  title: 'Pricing - Guardrailz',
  description: 'Simple, transparent pricing for AI guardrails. Start free, scale as you grow.',
};

const tiers = [
  {
    name: 'Free',
    tagline: 'For side projects and getting started',
    price: '₹0',
    period: '/ forever',
    cta: 'Get started',
    ctaHref: '/dashboard',
    highlighted: false,
    features: [
      '10,000 requests/day',
      '100 requests/minute',
      'All built-in profiles',
      'Custom profile creation',
      'Full API access',
      'Usage analytics',
      'Community support',
    ],
  },
  {
    name: 'Pro',
    tagline: 'For production apps that need speed',
    price: '₹2',
    period: '/ month',
    cta: 'Subscribe to Pro',
    ctaHref: null,
    highlighted: true,
    features: [
      '100,000 requests/day',
      '500 requests/minute',
      'Everything in Free',
      'Priority support',
      'Advanced analytics',
      'Custom guardrails',
      '99.9% uptime SLA',
    ],
  },
  {
    name: 'Enterprise',
    tagline: 'For orgs with compliance requirements',
    price: '₹4,999',
    period: '/ month',
    cta: 'Subscribe to Enterprise',
    ctaHref: null,
    highlighted: false,
    features: [
      'Unlimited requests',
      'Dedicated infrastructure',
      'Everything in Pro',
      'On-premise deployment',
      'Custom integrations',
      '24/7 dedicated support',
      'SLA guarantees',
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-hero-wash relative overflow-hidden pb-16 pt-20 lg:pb-20 lg:pt-28">
        <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm font-medium text-neutral-600">
              <TrendingUp className="h-4 w-4 text-brand-600" />
              Transparent pricing
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
              Simple pricing that scales with you
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-neutral-600">
              Start free, upgrade when you need more. No credit card required. Cancel anytime.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="relative overflow-hidden bg-neutral-50 py-16 lg:py-24">
        <div className="bg-glow-top pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl items-stretch gap-6 lg:grid-cols-3">
            {tiers.map((tier, i) => (
              <Reveal key={tier.name} delay={i * 0.08}>
                <div
                  className={`relative flex h-full flex-col rounded-2xl bg-white p-8 ${
                    tier.highlighted
                      ? 'border border-brand-300 shadow-lg shadow-brand-600/5'
                      : 'border border-neutral-200'
                  }`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center rounded-full bg-brand-600 px-3.5 py-1 text-xs font-semibold text-white shadow-sm">
                        Most popular
                      </span>
                    </div>
                  )}
                  <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
                    {tier.name}
                  </h2>
                  <p className="mt-1 text-sm text-neutral-500">{tier.tagline}</p>
                  <div className="mt-6 flex items-baseline gap-2">
                    <span
                      className={`text-4xl font-semibold tracking-tight ${
                        tier.highlighted ? 'text-brand-700' : 'text-neutral-900'
                      }`}
                    >
                      {tier.price}
                    </span>
                    <span className="text-sm text-neutral-500">{tier.period}</span>
                  </div>

                  {tier.ctaHref ? (
                    <Link href={tier.ctaHref} className="mt-8 block">
                      <Button className="ease-smooth w-full rounded-lg border border-neutral-300 bg-white py-2.5 font-semibold text-neutral-700 transition-all duration-300 hover:border-neutral-400 hover:bg-neutral-50">
                        {tier.cta}
                      </Button>
                    </Link>
                  ) : (
                    <CheckoutButton
                      plan={tier.name}
                      amount={tier.name === 'Pro' ? 2 : 4999}
                      className={`ease-smooth mt-8 w-full rounded-lg py-2.5 font-semibold shadow-sm transition-all duration-300 ${
                        tier.highlighted
                          ? 'bg-brand-600 text-white hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/20'
                          : 'border border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50'
                      }`}
                    >
                      {tier.cta}
                    </CheckoutButton>
                  )}

                  <ul className="mt-8 space-y-3 border-t border-neutral-100 pt-6">
                    {tier.features.map((feature) => (
                      <li
                        key={feature}
                        className={`flex items-start gap-3 text-sm ${
                          tier.highlighted ? 'font-medium text-neutral-700' : 'text-neutral-600'
                        }`}
                      >
                        <Check
                          className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                            tier.highlighted ? 'text-brand-600' : 'text-neutral-400'
                          }`}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 text-center" delay={0.1}>
            <p className="text-sm text-neutral-500">
              Need a custom plan?{' '}
              <a
                href="mailto:hello@guardrailz.dev"
                className="ease-smooth font-semibold text-brand-700 transition-colors duration-300 hover:text-brand-800"
              >
                Talk to our team →
              </a>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-white pb-24 pt-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50 px-6 py-14 text-center lg:px-16">
              <div className="bg-glow-top pointer-events-none absolute inset-0" />
              <div className="relative">
                <h2 className="mx-auto max-w-xl text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
                  Not sure which plan fits? Start on Free — it takes 60 seconds.
                </h2>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link href="/dashboard">
                    <Button className="ease-smooth group h-auto w-full rounded-lg bg-neutral-900 px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 sm:w-auto">
                      Create a free account
                      <ArrowRight className="ease-smooth ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="/docs">
                    <Button className="ease-smooth h-auto w-full rounded-lg border border-neutral-300 bg-white px-8 py-3.5 text-base font-semibold text-neutral-700 transition-all duration-300 hover:border-neutral-400 hover:bg-neutral-50 sm:w-auto">
                      Read the docs
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
