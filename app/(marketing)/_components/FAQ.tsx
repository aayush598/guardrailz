import { Card, CardContent } from '@/shared/ui/card';

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
  ];

  return (
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
          {faqs.map((faq, idx) => (
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
      </div>
    </section>
  );
}
