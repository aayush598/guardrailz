'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Zap, CheckCircle, ArrowRight, Code, Key, BarChart3, Menu, X, Github, Twitter, Linkedin, Sparkles, Globe, Users, TrendingUp, Star, ChevronRight } from 'lucide-react';
import {
  ShieldCheck,
  Building2,
  Baby,
  HeartPulse,
  Landmark,
  Wrench
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { UserButton } from '@clerk/nextjs';

export default function LandingPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Profiles', href: '#profiles' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Docs', href: '/docs' },
    { label: 'Hub', href: '/hub' },
  ];

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    } else {
      router.push(href);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Hero Section from landingfolio*/}
      
        <div className="relative bg-gray-50">
    <div className="absolute bottom-0 right-0 overflow-hidden lg:inset-y-0">
        <img className="w-auto h-full" src="https://d33wubrfki0l68.cloudfront.net/1e0fc04f38f5896d10ff66824a62e466839567f8/699b5/images/hero/3/background-pattern.png" alt="" />
    </div>

    <section className="relative py-12 sm:py-16 lg:py-20 lg:pb-36">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="grid max-w-lg grid-cols-1 mx-auto lg:max-w-full lg:items-center lg:grid-cols-2 gap-y-12 lg:gap-x-8">
                <div>
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold shadow-md">
              <Sparkles className="h-4 w-4" />
              <span>Trusted by 10,000+ Developers Worldwide</span>
            </div>
                    <div className="text-center lg:text-left">
                        <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl sm:leading-tight lg:leading-tight lg:text-6xl font-pj">
                          

              <span className="text-gray-900">Secure Your</span>
              <br />
              <span className="bg-gradient-to-r from-gray-600 to-gray-400 bg-clip-text text-transparent">
                AI Applications
              </span>
              <br />
              <span className="text-gray-900">with Confidence</span>
       

                        </h1>
                        <p className="mt-2 text-lg text-gray-600 sm:mt-8 font-inter">Enterprise-grade guardrails that detect PII, prevent prompt injection, and ensure compliance — all processed in parallel with sub-100ms latency.
           </p>

                        
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                size="lg"
                onClick={() => router.push('/sign-up')}
                className="bg-gradient-to-r from-gray-600 to-gray-600 hover:from-gray-700 hover:to-gray-700 text-white text-lg px-8 py-6 shadow-xl shadow-gray-500/30 hover:shadow-2xl hover:shadow-gray-500/40 transition-all duration-300 group"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('#how-it-works')}
                className="text-lg px-8 py-6 border-2 border-gray-300 hover:border-gray-600 hover:bg-gray-50 text-gray-700 hover:text-gray-600 transition-all duration-300"
              >
                View Documentation
              </Button>
            </div>

                    <div className="flex items-center justify-center mt-10 space-x-6 lg:justify-start sm:space-x-8">
                        <div className="flex items-center">
                            <p className="text-3xl font-medium text-gray-900 sm:text-4xl font-pj">2943</p>
                            <p className="ml-3 text-sm text-gray-900 font-pj">Guardrail<br />Executions</p>
                        </div>

                        <div className="hidden sm:block">
                            <svg className="text-gray-400" width="16" height="39" viewBox="0 0 16 39" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <line x1="0.72265" y1="10.584" x2="15.7226" y2="0.583975"></line>
                                <line x1="0.72265" y1="17.584" x2="15.7226" y2="7.58398"></line>
                                <line x1="0.72265" y1="24.584" x2="15.7226" y2="14.584"></line>
                                <line x1="0.72265" y1="31.584" x2="15.7226" y2="21.584"></line>
                                <line x1="0.72265" y1="38.584" x2="15.7226" y2="28.584"></line>
                            </svg>
                        </div>

                        <div className="flex items-center">
                            <p className="text-3xl font-medium text-gray-900 sm:text-4xl font-pj">50+</p>
                            <p className="ml-3 text-sm text-gray-900 font-pj">Total<br />Guardrails</p>
                        </div>
                    </div>
                </div>

                {/*Right Side hero section view*/}
               <div className="relative scale-[0.95]">
  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-2xl opacity-15 animate-pulse"></div>

  <div className="relative bg-white rounded-3xl shadow-xl shadow-blue-500/15 p-6 border border-gray-200">
    
    {/* Stats Cards */}
    <div className="grid grid-cols-2 gap-3 mb-5">
      {[
        { label: 'Guardrails', value: '50+', icon: Shield, color: 'gray' },
        { label: 'Processing', value: '<100ms', icon: Zap, color: 'gray' },
        { label: 'Uptime SLA', value: '99.9%', icon: TrendingUp, color: 'gray' },
        { label: 'Active Users', value: '10K+', icon: Users, color: 'gray' },
      ].map((stat) => (
        <div
          key={stat.label}
          className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-300 group"
        >
          <div
            className={`bg-gradient-to-r from-${stat.color}-100 to-${stat.color}-200 w-10 h-10 rounded-lg flex items-center justify-center mb-2 group-hover:scale-105 transition-transform`}
          >
            <stat.icon className={`h-5 w-5 text-${stat.color}-600`} />
          </div>

          <div
            className={`text-2xl font-semibold bg-gradient-to-r from-${stat.color}-600 to-${stat.color}-700 bg-clip-text text-transparent`}
          >
            {stat.value}
          </div>

          <div className="text-xs text-gray-600 font-medium mt-0.5">
            {stat.label}
          </div>
        </div>
      ))}
    </div>

    {/* Code Preview */}
    <div className="bg-gray-900 rounded-xl p-5 shadow-inner">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
      </div>

      <code className="text-sm text-gray-300 font-mono leading-relaxed">
        <span className="text-purple-400">const</span> response ={' '}
        <span className="text-purple-400">await</span>{' '}
        <span className="text-blue-400">fetch</span>(<br />
        &nbsp;&nbsp;
        <span className="text-green-400">
          'https://guardrailz.vercel.app/validate'
        </span>
        ,<br />
        &nbsp;&nbsp;{'{'} headers: {'{'}{' '}
        <span className="text-orange-400">'X-API-Key'</span>: key {'}'} {'}'}
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
      <section id="features" className="relative py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Comprehensive Protection
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Multi-layered security that adapts to your specific needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                className="bg-white border-gray-200 hover:border-gray-300 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group"
              >
                <CardContent className="pt-8 pb-6">
                  <div className={`bg-gradient-to-br ${feature.gradient} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{feature.desc}</p>
                  <div className="space-y-3">
                    {feature.features.map((item) => (
                      <div key={item} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
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
      <section id="profiles" className="relative py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-purple-100 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Globe className="h-4 w-4" />
              <span>Industry Solutions</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Pre-Built Security Profiles
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Industry-specific configurations ready to deploy in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { name: 'Default', desc: 'Balanced security and performance for general-purpose applications', icon: ShieldCheck, guardrails: 7, color: 'blue' },
              { name: 'Enterprise Security', desc: 'Maximum protection with strict controls for business-critical systems', icon: Building2, guardrails: 15, color: 'purple' },
              { name: 'Child Safety', desc: 'Content filtering and safety measures for educational platforms', icon: Baby, guardrails: 10, color: 'pink' },
              { name: 'Healthcare', desc: 'HIPAA-compliant guardrails for protected health information', icon: HeartPulse, guardrails: 8, color: 'green' },
              { name: 'Financial', desc: 'Regulatory compliance for banking and financial services', icon: Landmark, guardrails: 9, color: 'yellow' },
              { name: 'Minimal', desc: 'Lightweight validation for development and testing environments', icon: Wrench, guardrails: 1, color: 'gray' },
            ].map((profile) => (
              <Card
                key={profile.name}
                className="bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <CardContent className="pt-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-gradient-to-br from-gray-100 to-white border border-gray-200 w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                      <profile.icon className="h-7 w-7 text-gray-700" />
                    </div>

                    <div className="bg-blue-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">
                      {profile.guardrails} guardrails
                    </div>
                  </div>
                  <h4 className="font-bold text-xl mb-2 text-gray-900">{profile.name}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{profile.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={() => router.push('/sign-up')}
              variant="outline"
              className="border-2 border-gray-600 hover:bg-gray-600 hover:text-white text-gray-600 px-8 py-3 font-semibold transition-all duration-300"
            >
              Create Custom Profile
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Code className="h-4 w-4" />
              <span>Simple Integration</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Get Started in Minutes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple integration process with powerful results
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              { step: '1', icon: Key, title: 'Generate API Key', desc: 'Sign up and create your API key instantly from the dashboard. No credit card required for free tier.' },
              { step: '2', icon: Code, title: 'Integrate API', desc: 'Add our REST API or SDK to your application with just a few lines of code. Full documentation included.' },
              { step: '3', icon: BarChart3, title: 'Monitor & Scale', desc: 'Track usage, view analytics, and scale your guardrails as your application grows.' },
            ].map((item, idx) => (
              <div key={item.step} className="text-center relative">
                {idx < 2 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-gray-400 to-gray-300 -translate-x-1/2"></div>
                )}
                <div className="relative mb-6 inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-600 blur-2xl opacity-30"></div>
                  <div className="relative bg-gradient-to-br from-gray-800 to-gray-600 text-white w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-xl">
                    {item.step}
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-4 inline-block mb-4 shadow-lg border border-gray-200">
                  <item.icon className="h-10 w-10 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-yellow-100 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <TrendingUp className="h-4 w-4" />
              <span>Transparent Pricing</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start free and scale as you grow
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <Card className="bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-8">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">Free</h3>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold text-gray-900">₹0</span>
                  <span className="text-gray-600 ml-2">/ forever</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {['10,000 requests/day', '100 requests/minute', 'All built-in profiles', 'Custom profile creation', 'Full API access', 'Usage analytics', 'Community support'].map((feature) => (
                    <li key={feature} className="flex items-start space-x-3 text-gray-700">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white" onClick={() => router.push('/sign-up')}>
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Pro Tier */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 relative overflow-hidden scale-105">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-gray-800 to-gray-600 text-white px-6 py-2 text-sm font-bold rounded-bl-2xl shadow-lg">
                Coming Soon
              </div>
              <CardContent className="pt-8">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">Pro</h3>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">₹999</span>
                  <span className="text-gray-700 ml-2">/ month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {['100,000 requests/day', '500 requests/minute', 'Everything in Free', 'Priority support', 'Advanced analytics', 'Custom guardrails', '99.9% uptime SLA'].map((feature) => (
                    <li key={feature} className="flex items-start space-x-3 text-gray-700">
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-semibold">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-gradient-to-r from-gray-800 to-gray-600 text-white opacity-60 cursor-not-allowed">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Tier */}
            <Card className="bg-white border-2 border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-8">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">Enterprise</h3>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold text-gray-900">Custom</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {['Unlimited requests', 'Dedicated infrastructure', 'Everything in Pro', 'On-premise deployment', 'Custom integrations', '24/7 dedicated support', 'SLA guarantees'].map((feature) => (
                    <li key={feature} className="flex items-start space-x-3 text-gray-700">
                      <CheckCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full border-2 border-gray-300 hover:border-purple-600 hover:bg-purple-50 text-gray-900 font-semibold opacity-60 cursor-not-allowed">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-gray-600 mt-12 text-lg">
            No credit card required for free tier • Cancel anytime
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-gray-800 via-slate-600 to-gray-600">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6TTEyIDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00ek0yNCAzNGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjItMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-8">
              <Sparkles className="h-4 w-4" />
              <span>Join 10,000+ Developers</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-white">
              Ready to Secure Your AI Applications?
            </h2>
            
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
              Start protecting your LLM applications with intelligent guardrails today. No credit card required.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                onClick={() => router.push('/sign-up')}
                className="bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100 text-lg px-12 py-6 shadow-2xl hover:shadow-3xl transition-all duration-300 group font-bold"
              >
                Start Building Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('#pricing')}
                className="text-lg px-12 py-6 border-2 border-white text-gray-600 hover:bg-white hover:text-gray-900 transition-all duration-300 font-bold"
              >
                View Pricing
              </Button>
            </div>

            {/* Additional Trust Elements */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '99.9%', label: 'Uptime SLA' },
                { value: '<100ms', label: 'Response Time' },
                { value: '50+', label: 'Guardrails' },
                { value: '24/7', label: 'Support' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">{item.value}</div>
                  <div className="text-white/80 text-sm font-semibold">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof Section */}
      <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Star className="h-4 w-4 fill-gray-700" />
              <span>Loved by Developers</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what developers are saying about Guardrailz
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote: "Guardrailz has completely transformed how we handle sensitive data in our AI applications. The parallel processing is incredibly fast!",
                author: "Sarah Johnson",
                role: "CTO, TechCorp",
                rating: 5
              },
              {
                quote: "The pre-built profiles saved us weeks of development time. Healthcare compliance is now seamless with their HIPAA-ready guardrails.",
                author: "Dr. Michael Chen",
                role: "Lead Engineer, HealthAI",
                rating: 5
              },
              {
                quote: "Best-in-class API documentation and support. We integrated it in under an hour and have been running smoothly ever since.",
                author: "Emily Rodriguez",
                role: "Senior Developer, FinTech Solutions",
                rating: 5
              },
            ].map((testimonial, idx) => (
              <Card key={idx} className="bg-white border-gray-200 hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-600 to-gray-400 flex items-center justify-center text-white font-bold text-lg">
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
      <section className="relative py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about Guardrailz
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "How does the free tier work?",
                answer: "Our free tier includes 10,000 requests per day with full access to all built-in profiles and custom profile creation. No credit card required to get started."
              },
              {
                question: "What's the response time for guardrails?",
                answer: "Our parallel processing architecture ensures sub-100ms latency for all guardrail validations, even when running multiple checks simultaneously."
              },
              {
                question: "Can I create custom guardrails?",
                answer: "Yes! All tiers include custom profile creation. You can configure sensitivity levels, enable/disable specific checks, and create profiles tailored to your use case."
              },
              {
                question: "Is my data secure?",
                answer: "Absolutely. We use industry-standard encryption, don't store your sensitive data, and are SOC 2 Type II compliant. All processing happens in real-time without data retention."
              },
              {
                question: "Do you offer on-premise deployment?",
                answer: "Yes, on-premise deployment is available with our Enterprise plan. Contact our sales team for more information about dedicated infrastructure options."
              },
            ].map((faq, idx) => (
              <Card key={idx} className="bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Button
              variant="outline"
              className="border-2 border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white font-semibold px-8 transition-all duration-300"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-md opacity-50"></div>
                  <div className="relative bg-gradient-to-r from-gray-800 to-gray-600 p-2 rounded-xl">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Guardrailz
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                Enterprise-grade security guardrails for your LLM applications. Protect sensitive data, prevent prompt injection, and ensure compliance.
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
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-600 flex items-center justify-center text-gray-600 hover:text-white transition-all duration-300 group"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4 text-lg">Product</h4>
              <ul className="space-y-3">
                {['Features', 'Profiles', 'Pricing', 'Documentation', 'API Reference'].map((item) => (
                  <li key={item}>
                    <button className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4 text-lg">Company</h4>
              <ul className="space-y-3">
                {['About Us', 'Blog', 'Careers', 'Contact', 'Partners'].map((item) => (
                  <li key={item}>
                    <button className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-4 text-lg">Legal</h4>
              <ul className="space-y-3">
                {['Privacy Policy', 'Terms of Service', 'Security', 'Compliance', 'Cookie Policy'].map((item) => (
                  <li key={item}>
                    <button className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-600 text-sm">
                &copy; 2025 Guardrailz. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  Status
                </button>
                <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  Changelog
                </button>
                <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
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