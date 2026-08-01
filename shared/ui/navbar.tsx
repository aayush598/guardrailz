'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useUser, UserButton } from '@clerk/nextjs';
import { Shield, Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useEffect, useState } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Hub', href: '/hub' },
    { label: 'Blogs', href: '/blogs' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Docs', href: '/docs' },
  ];

  return (
    <nav
      className={`ease-smooth sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-neutral-200/70 bg-white/85 shadow-sm shadow-neutral-900/5 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between">
          {/* 1. Logo Section (Left) */}
          <div className="flex flex-shrink-0 items-center">
            <Link href="/" className="group flex cursor-pointer items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-neutral-900">
                Guardrailz
              </span>
            </Link>
          </div>

          {/* 2. Desktop Navigation (Center) */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center space-x-1 md:flex">
            {navItems.map((item) => {
              const isActive =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`ease-smooth group relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`ease-smooth absolute inset-x-4 -bottom-0.5 h-px bg-neutral-900 transition-opacity duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* 3. Action Buttons & Clerk (Right) */}
          <div className="hidden items-center space-x-4 md:flex">
            {isSignedIn ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button
                    size="sm"
                    className="h-9 rounded-lg bg-neutral-900 px-4 font-medium text-white transition-colors hover:bg-neutral-800"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 rounded-lg px-4 font-medium text-neutral-600 transition-colors hover:text-neutral-900"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button
                    size="sm"
                    className="h-9 rounded-lg bg-neutral-900 px-4 font-medium text-white transition-colors hover:bg-neutral-800"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            {isSignedIn && <UserButton afterSignOutUrl="/" />}
            <button
              className="p-2 text-neutral-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`ease-smooth grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 md:hidden ${
            mobileMenuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="min-h-0">
            <div className="space-y-1 border-t border-neutral-100 bg-white px-2 pb-3 pt-2">
              {navItems.map((item) => {
                const isActive =
                  item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`ease-smooth block w-full rounded-lg px-3 py-2 text-left text-base font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-neutral-100 text-neutral-900'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              {!isSignedIn && (
                <div className="mt-4 grid grid-cols-2 gap-2 px-3">
                  <Link href="/sign-in">
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button className="w-full bg-neutral-900 text-white">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
