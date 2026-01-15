'use client';

import { useRouter } from 'next/navigation';
import {
  Shield,
  Lock,
  Zap,
  CheckCircle,
  ArrowRight,
  Code,
  Key,
  BarChart3,
  Github,
  Twitter,
  Linkedin,
  Sparkles,
  Globe,
  Users,
  TrendingUp,
  Star,
  ChevronRight,
} from 'lucide-react';
import { ShieldCheck, Building2, Baby, HeartPulse, Landmark, Wrench } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import Image from 'next/image';

export default function LandingPageClient() {
  const router = useRouter();

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(href);
    }
  };

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

        <section className="relative py-12 sm:py-16 lg:py-20 lg:pb-36">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-lg grid-cols-1 gap-y-12 lg:max-w-full lg:grid-cols-2 lg:items-center lg:gap-x-8">
              <div>
                <div className="inline-flex items-center space-x-2 rounded-full border border-blue-200 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 text-sm font-semibold text-gray-700 shadow-md">
                  <Sparkles className="h-4 w-4" />
                  <span>Trusted by 10,000+ Developers Worldwide</span>
                </div>
                <div className="text-center lg:text-left">
                  <h1 className="font-pj text-4xl font-bold leading-tight text-gray-900 sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight">
                    <span className="text-gray-900">Secure Your</span>
                    <br />
                    <span className="bg-gradient-to-r from-gray-600 to-gray-400 bg-clip-text text-transparent">
                      AI Applications
                    </span>
                    <br />
                    <span className="text-gray-900">with Confidence</span>
                  </h1>
                  <p className="font-inter mt-2 text-lg text-gray-600 sm:mt-8">
                    Enterprise-grade guardrails that detect PII, prevent prompt injection, and
                    ensure compliance — all processed in parallel with sub-100ms latency.
                  </p>
                </div>
                <div className="flex flex-col gap-4 pt-6 sm:flex-row">
                  <Button
                    size="lg"
                    onClick={() => router.push('/sign-up')}
                    className="group bg-gradient-to-r from-gray-600 to-gray-600 px-8 py-6 text-lg text-white shadow-xl shadow-gray-500/30 transition-all duration-300 hover:from-gray-700 hover:to-gray-700 hover:shadow-2xl hover:shadow-gray-500/40"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => scrollToSection('#how-it-works')}
                    className="border-2 border-gray-300 px-8 py-6 text-lg text-gray-700 transition-all duration-300 hover:border-gray-600 hover:bg-gray-50 hover:text-gray-600"
                  >
                    View Documentation
                  </Button>
                </div>

                <div className="mt-10 flex items-center justify-center space-x-6 sm:space-x-8 lg:justify-start">
                  <div className="flex items-center">
                    <p className="font-pj text-3xl font-medium text-gray-900 sm:text-4xl">2943</p>
                    <p className="font-pj ml-3 text-sm text-gray-900">
                      Guardrail
                      <br />
                      Executions
                    </p>
                  </div>

                  <div className="hidden sm:block">
                    <svg
                      className="text-gray-400"
                      width="16"
                      height="39"
                      viewBox="0 0 16 39"
                      fill="none"
                      stroke="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <line x1="0.72265" y1="10.584" x2="15.7226" y2="0.583975"></line>
                      <line x1="0.72265" y1="17.584" x2="15.7226" y2="7.58398"></line>
                      <line x1="0.72265" y1="24.584" x2="15.7226" y2="14.584"></line>
                      <line x1="0.72265" y1="31.584" x2="15.7226" y2="21.584"></line>
                      <line x1="0.72265" y1="38.584" x2="15.7226" y2="28.584"></line>
                    </svg>
                  </div>

                  <div className="flex items-center">
                    <p className="font-pj text-3xl font-medium text-gray-900 sm:text-4xl">50+</p>
                    <p className="font-pj ml-3 text-sm text-gray-900">
                      Total
                      <br />
                      Guardrails
                    </p>
                  </div>
                </div>
              </div>

              {/*Right Side hero section view*/}
              <div className="relative scale-[0.95]">
                <div className="absolute inset-0 animate-pulse rounded-3xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-15 blur-2xl"></div>

                <div className="relative rounded-3xl border border-gray-200 bg-white p-6 shadow-xl shadow-blue-500/15">
                  {/* Stats Cards */}
                  <div className="mb-5 grid grid-cols-2 gap-3">
                    {[
                      { label: 'Guardrails', value: '50+', icon: Shield, color: 'gray' },
                      { label: 'Processing', value: '<100ms', icon: Zap, color: 'gray' },
                      { label: 'Uptime SLA', value: '99.9%', icon: TrendingUp, color: 'gray' },
                      { label: 'Active Users', value: '10K+', icon: Users, color: 'gray' },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="group rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 transition-all duration-300 hover:shadow-md"
                      >
                        <div
                          className={`bg-gradient-to-r from-${stat.color}-100 to-${stat.color}-200 mb-2 flex h-10 w-10 items-center justify-center rounded-lg transition-transform group-hover:scale-105`}
                        >
                          <stat.icon className={`h-5 w-5 text-${stat.color}-600`} />
                        </div>

                        <div
                          className={`bg-gradient-to-r text-2xl font-semibold from-${stat.color}-600 to-${stat.color}-700 bg-clip-text text-transparent`}
                        >
                          {stat.value}
                        </div>

                        <div className="mt-0.5 text-xs font-medium text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Code Preview */}
                  <div className="rounded-xl bg-gray-900 p-5 shadow-inner">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-500"></div>
                      <div className="h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                    </div>

                    <code className="font-mono text-sm leading-relaxed text-gray-300">
                      <span className="text-purple-400">const</span> response ={' '}
                      <span className="text-purple-400">await</span>{' '}
                      <span className="text-blue-400">fetch</span>(<br />
                      &nbsp;&nbsp;
                      <span className="text-green-400">
                        `&apos;`https://guardrailz.vercel.app/validate`&apos;`
                      </span>
                      ,<br />
                      &nbsp;&nbsp;{'{'} headers: {'{'}{' '}
                      <span className="text-orange-400">`&apos;`X-API-Key`&apos;`</span>: key {'}'}{' '}
                      {'}'}
                      <br />
                      );
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Features Section */}
      <section id="features" className="relative bg-gradient-to-b from-white to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center space-x-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-gray-700">
              <Sparkles className="h-4 w-4" />
              <span>Powerful Features</span>
            </div>
            <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
              Comprehensive Protection
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Multi-layered security that adapts to your specific needs
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            {[
              {
                icon: Shield,
                title: 'Input Validation',
                desc: 'Detect secrets, PII, PHI, and malicious patterns before they reach your LLM with real-time scanning and configurable sensitivity.',
                gradient: 'from-gray-500 to-gray-600',
                features: ['PII Detection', 'Secret Scanning', 'Prompt Injection Defense'],
              },
              {
                icon: Lock,
                title: 'Output Sanitization',
                desc: 'Automatically redact sensitive information from LLM responses to prevent data leaks and maintain confidentiality at scale.',
                gradient: 'from-gray-500 to-gray-600',
                features: ['PII Redaction', 'Leak Prevention', 'Schema Validation'],
              },
              {
                icon: Zap,
                title: 'Parallel Processing',
                desc: 'Execute multiple guardrails simultaneously with sub-100ms latency, built for production workloads and high throughput.',
                gradient: 'from-gray-500 to-gray-600',
                features: ['Concurrent Execution', 'Load Balancing', 'Auto-scaling'],
              },
            ].map((feature) => (
              <Card
                key={feature.title}
                className="group border-gray-200 bg-white transition-all duration-300 hover:border-gray-300 hover:shadow-2xl hover:shadow-blue-500/10"
              >
                <CardContent className="pb-6 pt-8">
                  <div
                    className={`bg-gradient-to-br ${feature.gradient} mb-6 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg transition-transform group-hover:scale-110`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-gray-900">{feature.title}</h3>
                  <p className="mb-6 leading-relaxed text-gray-600">{feature.desc}</p>
                  <div className="space-y-3">
                    {feature.features.map((item) => (
                      <div key={item} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="mr-3 h-5 w-5 flex-shrink-0 text-green-600" />
                        <span className="font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Profiles Section */}
      <section id="profiles" className="relative bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center space-x-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-gray-700">
              <Globe className="h-4 w-4" />
              <span>Industry Solutions</span>
            </div>
            <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
              Pre-Built Security Profiles
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Industry-specific configurations ready to deploy in minutes
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: 'Default',
                desc: 'Balanced security and performance for general-purpose applications',
                icon: ShieldCheck,
                guardrails: 7,
                color: 'blue',
              },
              {
                name: 'Enterprise Security',
                desc: 'Maximum protection with strict controls for business-critical systems',
                icon: Building2,
                guardrails: 15,
                color: 'purple',
              },
              {
                name: 'Child Safety',
                desc: 'Content filtering and safety measures for educational platforms',
                icon: Baby,
                guardrails: 10,
                color: 'pink',
              },
              {
                name: 'Healthcare',
                desc: 'HIPAA-compliant guardrails for protected health information',
                icon: HeartPulse,
                guardrails: 8,
                color: 'green',
              },
              {
                name: 'Financial',
                desc: 'Regulatory compliance for banking and financial services',
                icon: Landmark,
                guardrails: 9,
                color: 'yellow',
              },
              {
                name: 'Minimal',
                desc: 'Lightweight validation for development and testing environments',
                icon: Wrench,
                guardrails: 1,
                color: 'gray',
              },
            ].map((profile) => (
              <Card
                key={profile.name}
                className="group cursor-pointer border-gray-200 bg-gradient-to-br from-white to-gray-50 transition-all duration-300 hover:border-gray-300 hover:shadow-xl"
              >
                <CardContent className="pt-8">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-gray-200 bg-gradient-to-br from-gray-100 to-white transition-transform group-hover:scale-105">
                      <profile.icon className="h-7 w-7 text-gray-700" />
                    </div>

                    <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-gray-700">
                      {profile.guardrails} guardrails
                    </div>
                  </div>
                  <h4 className="mb-2 text-xl font-bold text-gray-900">{profile.name}</h4>
                  <p className="text-sm leading-relaxed text-gray-600">{profile.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              onClick={() => router.push('/sign-up')}
              variant="outline"
              className="border-2 border-gray-600 px-8 py-3 font-semibold text-gray-600 transition-all duration-300 hover:bg-gray-600 hover:text-white"
            >
              Create Custom Profile
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="relative bg-gradient-to-b from-slate-50 to-white py-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-20 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
              <Code className="h-4 w-4" />
              <span>Developer Friendly</span>
            </div>
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
              Get Started in Minutes
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              Three simple steps to protect and scale your AI applications.
            </p>
          </div>

          <div className="relative mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            <div
              className="absolute left-[15%] right-[15%] top-12 hidden h-0.5 border-t-2 border-dashed border-slate-300 md:block"
              aria-hidden="true"
            ></div>

            {[
              {
                step: '1',
                icon: Key,
                title: 'Generate API Key',
                desc: 'Sign up and create your API key instantly. No credit card required for our generous free tier.',
                color: 'bg-slate-700',
              },
              {
                step: '2',
                icon: Code,
                title: 'Integrate API',
                desc: 'Add our lightweight SDK to your app with just 3 lines of code. Works with all major frameworks.',
                color: 'bg-slate-700',
              },
              {
                step: '3',
                icon: BarChart3,
                title: 'Monitor & Scale',
                desc: 'Track latency and token usage in real-time. Scale your guardrails as your traffic grows.',
                color: 'bg-slate-700',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group relative flex flex-col items-center text-center"
              >
                <div className="relative mb-8">
                  <div
                    className={`absolute -right-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full ${item.color} text-sm font-bold text-white shadow-lg ring-4 ring-white`}
                  >
                    {item.step}
                  </div>

                  <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:border-transparent group-hover:shadow-xl">
                    <item.icon className="h-10 w-10 text-slate-700" />
                  </div>
                </div>

                <div className="px-4">
                  <h3 className="mb-3 text-xl font-bold text-slate-900">{item.title}</h3>
                  <p className="text-base leading-relaxed text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
                    ₹999
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
                <Button className="w-full cursor-not-allowed bg-gradient-to-r from-gray-800 to-gray-600 text-white opacity-60">
                  Coming Soon
                </Button>
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
                <Button
                  variant="outline"
                  className="w-full cursor-not-allowed border-2 border-gray-300 font-semibold text-gray-900 opacity-60 hover:border-purple-600 hover:bg-purple-50"
                >
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>

          <p className="mt-12 text-center text-lg text-gray-600">
            No credit card required for free tier • Cancel anytime
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-br from-gray-800 via-slate-600 to-gray-600 py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6TTEyIDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00ek0yNCAzNGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjItMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center space-x-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              <span>Join 10,000+ Developers</span>
            </div>

            <h2 className="mb-6 text-4xl font-extrabold text-white md:text-6xl">
              Ready to Secure Your AI Applications?
            </h2>

            <p className="mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-white/90 md:text-2xl">
              Start protecting your LLM applications with intelligent guardrails today. No credit
              card required.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={() => router.push('/sign-up')}
                className="hover:shadow-3xl group bg-white px-12 py-6 text-lg font-bold text-gray-600 shadow-2xl transition-all duration-300 hover:bg-gray-100 hover:text-gray-900"
              >
                Start Building Now
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('#pricing')}
                className="border-2 border-white px-12 py-6 text-lg font-bold text-gray-600 transition-all duration-300 hover:bg-white hover:text-gray-900"
              >
                View Pricing
              </Button>
            </div>

            {/* Additional Trust Elements */}
            <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
              {[
                { value: '99.9%', label: 'Uptime SLA' },
                { value: '<100ms', label: 'Response Time' },
                { value: '50+', label: 'Guardrails' },
                { value: '24/7', label: 'Support' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="mb-2 text-4xl font-extrabold text-white md:text-5xl">
                    {item.value}
                  </div>
                  <div className="text-sm font-semibold text-white/80">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center space-x-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-gray-700">
              <Star className="h-4 w-4 fill-gray-700" />
              <span>Loved by Developers</span>
            </div>
            <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
              Trusted by Industry Leaders
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              See what developers are saying about Guardrailz
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            {[
              {
                quote:
                  'Guardrailz has completely transformed how we handle sensitive data in our AI applications. The parallel processing is incredibly fast!',
                author: 'Sarah Johnson',
                role: 'CTO, TechCorp',
                rating: 5,
              },
              {
                quote:
                  'The pre-built profiles saved us weeks of development time. Healthcare compliance is now seamless with their HIPAA-ready guardrails.',
                author: 'Dr. Michael Chen',
                role: 'Lead Engineer, HealthAI',
                rating: 5,
              },
              {
                quote:
                  'Best-in-class API documentation and support. We integrated it in under an hour and have been running smoothly ever since.',
                author: 'Emily Rodriguez',
                role: 'Senior Developer, FinTech Solutions',
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <Card
                key={idx}
                className="border-gray-200 bg-white transition-all duration-300 hover:shadow-xl"
              >
                <CardContent className="pt-6">
                  <div className="mb-4 flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="mb-6 italic leading-relaxed text-gray-700">
                    `&quot;`{testimonial.quote}`&quot;`
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-gray-600 to-gray-400 text-lg font-bold text-white">
                      {testimonial.author[0]}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{testimonial.author}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Everything you need to know about Guardrailz
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-4">
            {[
              {
                question: 'How does the free tier work?',
                answer:
                  'Our free tier includes 10,000 requests per day with full access to all built-in profiles and custom profile creation. No credit card required to get started.',
              },
              {
                question: "What's the response time for guardrails?",
                answer:
                  'Our parallel processing architecture ensures sub-100ms latency for all guardrail validations, even when running multiple checks simultaneously.',
              },
              {
                question: 'Can I create custom guardrails?',
                answer:
                  'Yes! All tiers include custom profile creation. You can configure sensitivity levels, enable/disable specific checks, and create profiles tailored to your use case.',
              },
              {
                question: 'Is my data secure?',
                answer:
                  "Absolutely. We use industry-standard encryption, don't store your sensitive data, and are SOC 2 Type II compliant. All processing happens in real-time without data retention.",
              },
              {
                question: 'Do you offer on-premise deployment?',
                answer:
                  'Yes, on-premise deployment is available with our Enterprise plan. Contact our sales team for more information about dedicated infrastructure options.',
              },
            ].map((faq, idx) => (
              <Card
                key={idx}
                className="border-gray-200 bg-gradient-to-br from-white to-gray-50 transition-all duration-300 hover:border-gray-300 hover:shadow-lg"
              >
                <CardContent className="pt-6">
                  <h3 className="mb-3 text-lg font-bold text-gray-900">{faq.question}</h3>
                  <p className="leading-relaxed text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="mb-4 text-gray-600">Still have questions?</p>
            <Button
              variant="outline"
              className="border-2 border-gray-600 px-8 font-semibold text-gray-600 transition-all duration-300 hover:bg-gray-600 hover:text-white"
            >
              Contact Support
            </Button>
          </div>
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
