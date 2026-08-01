import { Navbar } from '@/shared/ui/navbar';
import Footer from './_components/Footer';
import SmoothScroll from './_components/SmoothScroll';

export const metadata = {
  title: 'Guardrailz - Secure Your AI Applications',
  description: 'Enterprise-grade guardrails for LLM applications with sub-100ms latency',
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SmoothScroll />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
