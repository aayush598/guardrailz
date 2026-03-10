import Hero from './_components/Hero';
import Features from './_components/Features';
import Profiles from './_components/Profiles';
import HowItWorks from './_components/HowItWorks';
import Pricing from './_components/Pricing';
import CTA from './_components/CTA';
import Testimonials from './_components/Testimonials';
import FAQ from './_components/FAQ';

export default function Page() {
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

      <div className="relative">
        <Hero />
        <Features />
        <Profiles />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
      </div>
    </div>
  );
}
