import { Key, Code, BarChart3 } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
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
  ];

  return (
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

          {steps.map((item) => (
            <div key={item.step} className="group relative flex flex-col items-center text-center">
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
  );
}
