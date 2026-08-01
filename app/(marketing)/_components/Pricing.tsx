import Link from 'next/link';
import { TrendingUp, Check } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { CheckoutButton } from './CheckoutButton';
import Reveal from './Reveal';

export default function Pricing() {
  const freeFeatures = [
    '10,000 requests/day',
    '100 requests/minute',
    'All built-in profiles',
    'Custom profile creation',
    'Full API access',
    'Usage analytics',
    'Community support',
  ];

  const proFeatures = [
    '100,000 requests/day',
    '500 requests/minute',
    'Everything in Free',
    'Priority support',
    'Advanced analytics',
    'Custom guardrails',
    '99.9% uptime SLA',
  ];

  const enterpriseFeatures = [
    'Unlimited requests',
    'Dedicated infrastructure',
    'Everything in Pro',
    'On-premise deployment',
    'Custom integrations',
    '24/7 dedicated support',
    'SLA guarantees',
  ];

  return (
    <section
      id="pricing"
      className="relative overflow-hidden border-t border-neutral-100 bg-neutral-50 py-24 lg:py-32"
    >
      <div className="bg-glow-top pointer-events-none absolute inset-0" />
      <div className="bg-grid-faint pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm font-medium text-neutral-600">
            <TrendingUp className="h-4 w-4 text-brand-600" />
            Transparent pricing
          </span>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            Start free, scale as you go
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-neutral-600">
            No credit card required. Cancel anytime.
          </p>
        </Reveal>

        <div className="mx-auto grid max-w-6xl items-stretch gap-6 lg:grid-cols-3">
          {/* Free */}
          <Reveal delay={0.05}>
            <div className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-8">
              <h3 className="text-lg font-semibold tracking-tight text-neutral-900">Free</h3>
              <p className="mt-1 text-sm text-neutral-500">For side projects and getting started</p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-semibold tracking-tight text-neutral-900">₹0</span>
                <span className="text-sm text-neutral-500">/ forever</span>
              </div>
              <Link href="/dashboard" className="mt-8 block">
                <Button className="ease-smooth w-full rounded-lg border border-neutral-300 bg-white py-2.5 font-semibold text-neutral-700 transition-all duration-300 hover:border-neutral-400 hover:bg-neutral-50">
                  Get started
                </Button>
              </Link>
              <ul className="mt-8 space-y-3 border-t border-neutral-100 pt-6">
                {freeFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-neutral-600">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-neutral-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Pro — highlighted */}
          <Reveal delay={0.12}>
            <div className="relative flex h-full flex-col rounded-2xl border border-brand-300 bg-white p-8 shadow-lg shadow-brand-600/5">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center rounded-full bg-brand-600 px-3.5 py-1 text-xs font-semibold text-white shadow-sm">
                  Most popular
                </span>
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-neutral-900">Pro</h3>
              <p className="mt-1 text-sm text-neutral-500">For production apps that need speed</p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-semibold tracking-tight text-brand-700">₹2</span>
                <span className="text-sm text-neutral-500">/ month</span>
              </div>
              <CheckoutButton
                plan="Pro"
                amount={2}
                className="ease-smooth mt-8 w-full rounded-lg bg-brand-600 py-2.5 font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/20"
              >
                Subscribe to Pro
              </CheckoutButton>
              <ul className="mt-8 space-y-3 border-t border-neutral-100 pt-6">
                {proFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm font-medium text-neutral-700"
                  >
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Enterprise */}
          <Reveal delay={0.19}>
            <div className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-8">
              <h3 className="text-lg font-semibold tracking-tight text-neutral-900">Enterprise</h3>
              <p className="mt-1 text-sm text-neutral-500">For orgs with compliance requirements</p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-semibold tracking-tight text-neutral-900">
                  ₹4,999
                </span>
                <span className="text-sm text-neutral-500">/ month</span>
              </div>
              <CheckoutButton
                plan="Enterprise"
                amount={4999}
                className="ease-smooth mt-8 w-full rounded-lg border border-neutral-300 bg-white py-2.5 font-semibold text-neutral-700 transition-all duration-300 hover:border-neutral-400 hover:bg-neutral-50"
              >
                Subscribe to Enterprise
              </CheckoutButton>
              <ul className="mt-8 space-y-3 border-t border-neutral-100 pt-6">
                {enterpriseFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-neutral-600">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-neutral-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
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
  );
}
