import { Navbar } from '@/shared/ui/navbar';

export const metadata = {
  title: 'Guardrailz - Secure Your AI Applications',
  description: 'Enterprise-grade guardrails for LLM applications with sub-100ms latency',
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
