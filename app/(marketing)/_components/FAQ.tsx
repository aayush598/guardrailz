'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, ChevronRight, HelpCircle, MessagesSquare, Plus } from 'lucide-react';
import Reveal from './Reveal';

export default function FAQ() {
  const faqs = [
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
        'Yes! All tiers include custom profile creation. You can configure sensitivity levels, enable or disable specific checks, and create profiles tailored to your use case.',
    },
    {
      question: 'Is my data secure?',
      answer:
        'Absolutely. We use industry-standard encryption, do not store your sensitive data, and are SOC 2 Type II compliant. All processing happens in real time without data retention.',
    },
    {
      question: 'Do you offer on-premise deployment?',
      answer:
        'Yes, on-premise deployment is available with our Enterprise plan. Contact our sales team for more information about dedicated infrastructure options.',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative overflow-hidden border-t border-neutral-100 bg-white py-24 lg:py-32">
      <div className="bg-glow-bottom pointer-events-none absolute inset-0" />
      <div className="bg-dots pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_40%_50%_at_100%_100%,black,transparent)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm font-medium text-neutral-600">
                <HelpCircle className="h-4 w-4 text-brand-600" />
                FAQ
              </span>
              <h2 className="mt-6 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
                Questions, answered
              </h2>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-neutral-600">
                Everything you need to know about Guardrailz. Can&apos;t find your answer?
                We&apos;re here to help.
              </p>

              <div className="mt-10 rounded-2xl border border-neutral-200 bg-neutral-50/70 p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 shadow-sm shadow-brand-600/25">
                  <MessagesSquare className="h-5 w-5 text-white" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-neutral-900">
                  Still have questions?
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  Check out the docs or get in touch — our team usually responds within a few hours.
                </p>
                <div className="mt-5 flex flex-col gap-2">
                  <Link
                    href="/docs"
                    className="ease-smooth group flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-800 transition-all duration-300 hover:border-brand-200 hover:text-brand-700"
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <BookOpen className="h-4 w-4 text-neutral-400 transition-colors duration-300 group-hover:text-brand-600" />
                      Browse the docs
                    </span>
                    <ChevronRight className="ease-smooth h-4 w-4 text-neutral-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-brand-600" />
                  </Link>
                  <Link
                    href="mailto:support@guardrailz.dev"
                    className="ease-smooth group flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-800 transition-all duration-300 hover:border-brand-200 hover:text-brand-700"
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <MessagesSquare className="h-4 w-4 text-neutral-400 transition-colors duration-300 group-hover:text-brand-600" />
                      Contact support
                    </span>
                    <ChevronRight className="ease-smooth h-4 w-4 text-neutral-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-brand-600" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={faq.question}
                    className={`ease-smooth overflow-hidden rounded-xl border bg-white transition-colors duration-300 ${
                      isOpen
                        ? 'border-neutral-300 shadow-sm shadow-neutral-900/5'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="flex w-full cursor-pointer select-none items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <span className="text-base font-semibold text-neutral-900">
                        {faq.question}
                      </span>
                      <span
                        className={`ease-smooth flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-500 transition-transform duration-300 ${
                          isOpen ? 'rotate-45' : 'rotate-0'
                        }`}
                      >
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>
                    <div
                      className={`ease-smooth grid transition-[grid-template-rows] duration-300 ${
                        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-6 pb-5 leading-relaxed text-neutral-600">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
