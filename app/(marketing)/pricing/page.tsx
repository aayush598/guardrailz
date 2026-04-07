'use client';

import { useRouter } from 'next/navigation';
import { Shield, CheckCircle, Github, Twitter, Linkedin, TrendingUp } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { CheckoutButton } from '../_components/CheckoutButton';
import Image from 'next/image';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Decorative Elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-blue-200/30 blur-3xl"></div>
        <div
          className="absolute right-1/4 top-1/3 h-96 w-96 animate-pulse rounded-full bg-purple-200/30 blur-3xl"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 h-96 w-96 animate-pulse rounded-full bg-pink-200/20 blur-3xl"
          style={{ animationDelay: '4s' }}
        ></div>
      </div>

      {/* Hero Section from landingfolio*/}

      <div className="relative bg-gray-50">
        <div className="absolute bottom-0 right-0 overflow-hidden lg:inset-y-0">
          <Image
            className="h-full w-auto"
            src="/images/HeroSection.png"
            alt=""
            width={800}
            height={600}
            priority
          />
        </div>
      </div>

      {/* Pricing Section */}
      <section id="pricing" className="relative bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center space-x-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-gray-700">
              <TrendingUp className="h-4 w-4" />
              <span>Transparent Pricing</span>
            </div>
            <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Start free and scale as you grow
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {/* Free Tier */}
            <Card className="border-2 border-gray-200 bg-white transition-all duration-300 hover:border-gray-300 hover:shadow-xl">
              <CardContent className="pt-8">
                <h3 className="mb-2 text-2xl font-bold text-gray-900">Free</h3>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold text-gray-900">₹0</span>
                  <span className="ml-2 text-gray-600">/ forever</span>
                </div>
                <ul className="mb-8 space-y-4">
                  {[
                    '10,000 requests/day',
                    '100 requests/minute',
                    'All built-in profiles',
                    'Custom profile creation',
                    'Full API access',
                    'Usage analytics',
                    'Community support',
                  ].map((feature) => (
                    <li key={feature} className="flex items-start space-x-3 text-gray-700">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                      <span className="text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-gray-900 text-white hover:bg-gray-800"
                  onClick={() => router.push('/sign-up')}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Pro Tier */}
            <Card className="relative scale-105 overflow-hidden border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-purple-50 transition-all duration-300 hover:border-blue-400 hover:shadow-2xl">
              <div className="absolute right-0 top-0 rounded-bl-2xl bg-gradient-to-r from-gray-800 to-gray-600 px-6 py-2 text-sm font-bold text-white shadow-lg">
                Coming Soon
              </div>
              <CardContent className="pt-8">
                <h3 className="mb-2 text-2xl font-bold text-gray-900">Pro</h3>
                <div className="mb-6">
                  <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-5xl font-extrabold text-transparent">
                    ₹2
                  </span>
                  <span className="ml-2 text-gray-700">/ month</span>
                </div>
                <ul className="mb-8 space-y-4">
                  {[
                    '100,000 requests/day',
                    '500 requests/minute',
                    'Everything in Free',
                    'Priority support',
                    'Advanced analytics',
                    'Custom guardrails',
                    '99.9% uptime SLA',
                  ].map((feature) => (
                    <li key={feature} className="flex items-start space-x-3 text-gray-700">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                      <span className="text-sm font-semibold">{feature}</span>
                    </li>
                  ))}
                </ul>
                <CheckoutButton
                  plan="Pro"
                  amount={2}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                >
                  Subscribe to Pro
                </CheckoutButton>
              </CardContent>
            </Card>

            {/* Enterprise Tier */}
            <Card className="border-2 border-gray-200 bg-white transition-all duration-300 hover:border-purple-300 hover:shadow-xl">
              <CardContent className="pt-8">
                <h3 className="mb-2 text-2xl font-bold text-gray-900">Enterprise</h3>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold text-gray-900">Custom</span>
                </div>
                <ul className="mb-8 space-y-4">
                  {[
                    'Unlimited requests',
                    'Dedicated infrastructure',
                    'Everything in Pro',
                    'On-premise deployment',
                    'Custom integrations',
                    '24/7 dedicated support',
                    'SLA guarantees',
                  ].map((feature) => (
                    <li key={feature} className="flex items-start space-x-3 text-gray-700">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-600" />
                      <span className="text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <CheckoutButton
                  plan="Enterprise"
                  amount={4999}
                  className="w-full border-2 border-purple-600 bg-purple-50 font-semibold text-purple-700 hover:bg-purple-100"
                >
                  Subscribe to Enterprise
                </CheckoutButton>
              </CardContent>
            </Card>
          </div>

          <p className="mt-12 text-center text-lg text-gray-600">
            No credit card required for free tier • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 grid gap-12 md:grid-cols-5">
            <div className="md:col-span-2">
              <div className="mb-4 flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-50 blur-md"></div>
                  <div className="relative rounded-xl bg-gradient-to-r from-gray-800 to-gray-600 p-2">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                </div>
                <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-xl font-bold text-transparent">
                  Guardrailz
                </span>
              </div>
              <p className="mb-6 leading-relaxed text-gray-600">
                Enterprise-grade security guardrails for your LLM applications. Protect sensitive
                data, prevent prompt injection, and ensure compliance.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: Github, href: '#', label: 'GitHub' },
                  { icon: Twitter, href: '#', label: 'Twitter' },
                  { icon: Linkedin, href: '#', label: 'LinkedIn' },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="group flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-all duration-300 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-600 hover:text-white"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-lg font-bold text-gray-900">Product</h4>
              <ul className="space-y-3">
                {['Features', 'Profiles', 'Pricing', 'Documentation', 'API Reference'].map(
                  (item) => (
                    <li key={item}>
                      <button className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
                        {item}
                      </button>
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-lg font-bold text-gray-900">Company</h4>
              <ul className="space-y-3">
                {['About Us', 'Blog', 'Careers', 'Contact', 'Partners'].map((item) => (
                  <li key={item}>
                    <button className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-lg font-bold text-gray-900">Legal</h4>
              <ul className="space-y-3">
                {[
                  'Privacy Policy',
                  'Terms of Service',
                  'Security',
                  'Compliance',
                  'Cookie Policy',
                ].map((item) => (
                  <li key={item}>
                    <button className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-sm text-gray-600">&copy; 2025 Guardrailz. All rights reserved.</p>
              <div className="flex items-center gap-6">
                <button className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
                  Status
                </button>
                <button className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
                  Changelog
                </button>
                <button className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
                  Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
