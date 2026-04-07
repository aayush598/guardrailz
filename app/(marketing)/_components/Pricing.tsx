import Link from 'next/link';
import { TrendingUp, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { CheckoutButton } from './CheckoutButton';

export default function Pricing() {
  return (
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
              <Link href="/dashboard" className="block">
                <Button className="w-full bg-gray-900 text-white hover:bg-gray-800">
                  Get Started
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pro Tier */}
          <Card className="relative scale-105 overflow-hidden border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-purple-50 transition-all duration-300 hover:border-blue-400 hover:shadow-2xl">
            <div className="absolute right-0 top-0 rounded-bl-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 text-sm font-bold text-white shadow-lg">
              Most Popular
            </div>
            <CardContent className="pt-8">
              <h3 className="mb-2 text-2xl font-bold text-gray-900">Pro</h3>
              <div className="mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-5xl font-extrabold text-transparent">
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
                <span className="text-5xl font-extrabold text-gray-900">₹4999</span>
                <span className="ml-2 text-gray-700">/ month</span>
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

        <div className="mt-12 text-center text-lg text-gray-600">
          No credit card required for free tier • Cancel anytime
        </div>
      </div>
    </section>
  );
}
