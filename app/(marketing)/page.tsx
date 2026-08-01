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
    <div className="min-h-screen bg-white">
      <Hero />
      <Features />
      <Profiles />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
    </div>
  );
}
