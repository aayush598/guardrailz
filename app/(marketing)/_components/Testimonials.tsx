import { Star } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/card';

export default function Testimonials() {
  const testimonials = [
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
  ];

  return (
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
          {testimonials.map((testimonial, idx) => (
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
                  &quot;{testimonial.quote}&quot;
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
  );
}
