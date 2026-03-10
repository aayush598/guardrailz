'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, Shield, Zap, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import Image from 'next/image';

export default function Hero() {
  const router = useRouter();

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(href);
    }
  };

  return (
    <div className="relative bg-gray-50/50">
      <div className="absolute bottom-0 right-0 overflow-hidden lg:inset-y-0">
        <Image
          className="h-full w-auto"
          src="/images/HeroSection.png"
          alt="Hero Section"
          width={800}
          height={600}
          priority
        />
      </div>

      <section className="relative pb-12 pt-4 sm:pb-16 sm:pt-6 lg:pb-36 lg:pt-8">
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
                <p className="mt-2 font-inter text-lg text-gray-600 sm:mt-8">
                  Enterprise-grade guardrails that detect PII, prevent prompt injection, and ensure
                  compliance — all processed in parallel with sub-100ms latency.
                </p>
              </div>
              <div className="flex flex-col gap-4 pt-6 sm:flex-row">
                <Button
                  size="lg"
                  onClick={() => router.push('/dashboard')}
                  className="group border-2 border-transparent bg-gradient-to-r from-gray-600 to-gray-600 px-8 py-6 text-lg text-white shadow-xl shadow-gray-500/30 transition-all duration-300 hover:from-gray-700 hover:to-gray-700 hover:shadow-2xl hover:shadow-gray-500/40"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection('/docs')}
                  className="border-2 border-gray-300 px-8 py-6 text-lg text-gray-700 transition-all duration-300 hover:border-gray-600 hover:bg-gray-50 hover:text-gray-600"
                >
                  View Documentation
                </Button>
              </div>

              <div className="mt-10 flex items-center justify-center space-x-6 sm:space-x-8 lg:justify-start">
                <div className="flex items-center">
                  <p className="font-pj text-3xl font-medium text-gray-900 sm:text-4xl">2943</p>
                  <p className="ml-3 font-pj text-sm text-gray-900">
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
                  <p className="ml-3 font-pj text-sm text-gray-900">
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
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 transition-transform group-hover:scale-105">
                        <stat.icon className="h-5 w-5 text-gray-600" />
                      </div>

                      <div className="bg-gradient-to-r from-gray-600 to-gray-700 bg-clip-text text-2xl font-semibold text-transparent">
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

                  <pre className="font-mono text-xs leading-normal text-gray-300 md:text-sm">
                    <code>
                      <span className="text-purple-400">const</span> client ={' '}
                      <span className="text-purple-400">new</span>{' '}
                      <span className="text-yellow-400">GuardrailsClient</span>({'{'}
                      <br />
                      &nbsp;&nbsp;apiKey:{' '}
                      <span className="text-green-400">&apos;grd_live_...&apos;</span>
                      <br />
                      {'}'});
                      <br />
                      <br />
                      <span className="text-purple-400">const</span> res ={' '}
                      <span className="text-purple-400">await</span> client.
                      <span className="text-blue-400">validate</span>({'{'}
                      <br />
                      &nbsp;&nbsp;text:{' '}
                      <span className="text-green-400">&apos;Hello SDK test&apos;</span>,
                      <br />
                      &nbsp;&nbsp;profileName:{' '}
                      <span className="text-green-400">&apos;default&apos;</span>
                      <br />
                      &nbsp;&nbsp;validationType:{' '}
                      <span className="text-green-400">&apos;input&apos;</span>
                      <br />
                      {'}'});
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
