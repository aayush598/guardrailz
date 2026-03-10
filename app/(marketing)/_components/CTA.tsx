import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export default function CTA() {
  return (
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
            Start protecting your LLM applications with intelligent guardrails today. No credit card
            required.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="hover:shadow-3xl group w-full bg-white px-12 py-6 text-lg font-bold text-gray-600 shadow-2xl transition-all duration-300 hover:bg-gray-100 hover:text-gray-900 sm:w-auto"
              >
                Start Building Now
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                size="lg"
                className="w-full bg-white px-12 py-6 text-lg font-bold text-gray-600 transition-all duration-300 hover:bg-gray-100 hover:text-gray-900 sm:w-auto"
              >
                View Pricing
              </Button>
            </Link>
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
  );
}
