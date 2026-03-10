import { Shield, Lock, Zap, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/card';

export default function Features() {
  const features = [
    {
      icon: Shield,
      title: 'Input Validation',
      desc: 'Detect secrets, PII, PHI, and malicious patterns before they reach your LLM with real-time scanning and configurable sensitivity.',
      gradient: 'from-gray-500 to-gray-600',
      items: ['PII Detection', 'Secret Scanning', 'Prompt Injection Defense'],
    },
    {
      icon: Lock,
      title: 'Output Sanitization',
      desc: 'Automatically redact sensitive information from LLM responses to prevent data leaks and maintain confidentiality at scale.',
      gradient: 'from-gray-500 to-gray-600',
      items: ['PII Redaction', 'Leak Prevention', 'Schema Validation'],
    },
    {
      icon: Zap,
      title: 'Parallel Processing',
      desc: 'Execute multiple guardrails simultaneously with sub-100ms latency, built for production workloads and high throughput.',
      gradient: 'from-gray-500 to-gray-600',
      items: ['Concurrent Execution', 'Load Balancing', 'Auto-scaling'],
    },
  ];

  return (
    <section id="features" className="relative bg-gradient-to-b from-white to-blue-50 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center space-x-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-gray-700">
            <Zap className="h-4 w-4" />
            <span>Powering AI Safety</span>
          </div>
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Comprehensive Protection
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Multi-layered security that adapts to your specific needs
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {features.map((feature) => (
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
                  {feature.items.map((item) => (
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
  );
}
