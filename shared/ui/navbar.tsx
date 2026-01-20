'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useUser, UserButton } from '@clerk/nextjs';
import { Shield, Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useEffect, useState } from 'react';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-gray-100 bg-white/80 shadow-sm backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between">
          {/* 1. Logo Section (Left) */}
          <div className="flex flex-shrink-0 items-center">
            <Link href="/" className="group flex cursor-pointer items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-gray-500 opacity-20 blur-md transition-opacity group-hover:opacity-40"></div>
                <div className="relative rounded-xl bg-gray-900 p-2">
                  <Shield className="h-5 w-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">Guardrailz</span>
            </Link>
          </div>

          {/* 2. Desktop Navigation (Center - Perfectly Aligned) */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center space-x-2 md:flex">
            {navItems.map((item) => {
              const isActive =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`group relative px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>{item.label}</span>

                  {/* The Animated Line Effect */}
                  <span
                    className={`absolute inset-x-4 bottom-1 h-0.5 origin-left bg-gray-900 transition-transform duration-300 ease-out ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
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
                <Button
                  onClick={() => router.push('/dashboard')}
                  size="sm"
                  className="rounded-full bg-gray-700 text-white hover:bg-gray-800"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/sign-in')}
                  className="text-gray-600"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push('/sign-up')}
                  className="rounded-full bg-gray-900 text-white hover:bg-gray-800"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            {isSignedIn && <UserButton afterSignOutUrl="/" />}
            <button
              className="p-2 text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-100 bg-white py-4 md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navItems.map((item) => {
                const isActive =
                  item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block w-full rounded-lg px-3 py-2 text-left text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              {!isSignedIn && (
                <div className="mt-4 grid grid-cols-2 gap-2 px-3">
                  <Button variant="outline" onClick={() => router.push('/sign-in')}>
                    Sign In
                  </Button>
                  <Button onClick={() => router.push('/sign-up')}>Sign Up</Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
