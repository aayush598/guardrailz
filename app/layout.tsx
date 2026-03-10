import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
});

export const metadata = {
  title: 'Guardrailz - AI Safety & Guardrails Platform',
  description:
    'Guardrailz helps developers build safe AI systems with policy enforcement and monitoring.',
  keywords: ['AI guardrails', 'LLM safety', 'AI monitoring', 'AI compliance'],
  verification: {
    google: 'KFgLDpdA_8ujeUi43-x9ylKW7EExlpYUmmPVA8Yf4-4',
  },
  openGraph: {
    title: 'Guardrailz',
    description: 'AI safety guardrails for modern applications',
    url: 'https://guardrailz.vercel.app',
    siteName: 'Guardrailz',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'SoftwareApplication',
                name: 'Guardrailz',
                applicationCategory: 'DeveloperApplication',
                operatingSystem: 'Web',
                url: 'https://guardrailz.vercel.app',
              }),
            }}
          />
        </head>
        <body className={`${inter.className} antialiased`}>
          {children}
          <Toaster position="bottom-right" richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
