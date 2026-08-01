import Link from 'next/link';
import { Shield, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Profiles', href: '/hub/profiles/default' },
      { label: 'Hub', href: '/hub' },
      { label: 'Changelog', href: '/blogs' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/docs/api' },
      { label: 'SDKs', href: '/docs/sdk' },
      { label: 'Blog', href: '/blogs' },
      { label: 'Status', href: '/' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/' },
      { label: 'Contact', href: 'mailto:hello@guardrailz.dev' },
      { label: 'Terms', href: '/' },
      { label: 'Privacy', href: '/' },
    ],
  },
];

const socials = [
  { label: 'GitHub', icon: Github, href: 'https://github.com' },
  { label: 'X', icon: Twitter, href: 'https://x.com' },
  { label: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
  { label: 'Email', icon: Mail, href: 'mailto:hello@guardrailz.dev' },
];

export default function Footer() {
  return (
    <footer className="border-t border-neutral-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-neutral-900">
                Guardrailz
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-neutral-500">
              Enterprise-grade guardrails for LLM applications. PII detection, prompt-injection
              defense, and compliance — all in parallel, under 100ms.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noreferrer"
                  className="ease-smooth flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:text-neutral-900"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-semibold text-neutral-900">{col.title}</h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="ease-smooth text-sm text-neutral-500 transition-colors duration-300 hover:text-neutral-900"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-neutral-100 pt-8 sm:flex-row">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} Guardrailz. All rights reserved.
          </p>
          <p className="text-sm text-neutral-500">Built for developers who ship AI responsibly.</p>
        </div>
      </div>
    </footer>
  );
}
