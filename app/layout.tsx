import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { MarketingNavbar } from '@/components/ui/navbar';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
});

export const metadata = {
  title: 'Guardrailz - Secure Your AI Applications',
  description: 'Enterprise-grade guardrails for LLM applications with sub-100ms latency',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
        <body className={`${inter.className} antialiased`}>
          <MarketingNavbar/>{children}</body>
      </html>
    </ClerkProvider>
  );
}