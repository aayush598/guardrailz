'use client';

import { useRouter } from 'next/navigation';
import { useUser, UserButton } from '@clerk/nextjs';
import { Shield, Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useEffect, useState } from 'react';

export function MarketingNavbar() {
  const router = useRouter();
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

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    } else {
      router.push(href);
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 shadow-lg shadow-blue-100/50 backdrop-blur-xl' : 'bg-white/50 backdrop-blur-sm'}`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div
            className="group flex cursor-pointer items-center space-x-3"
            onClick={() => router.push('/')}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-500 to-slate-500 opacity-50 blur-md transition-opacity group-hover:opacity-75"></div>
              <div className="relative rounded-xl bg-gray-700 p-2">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
            <span className="bg-gradient-to-r from-slate-900 to-gray-700 bg-clip-text text-2xl font-bold text-transparent">
              Guardrailz
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className="group relative text-sm font-semibold text-gray-700 transition-colors duration-200 hover:text-gray-900"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-gray-800 to-gray-600 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </div>

          <div className="hidden items-center space-x-4 md:flex">
            {isSignedIn ? (
              <Button
                onClick={() => router.push('/dashboard')}
                className="bg-gradient-to-r from-gray-600 to-slate-700 text-white shadow-lg shadow-gray-500/30 transition-all duration-300 hover:from-gray-700 hover:to-slate-700 hover:shadow-xl hover:shadow-gray-500/40"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => router.push('/sign-in')}
                  className="text-gray-700 hover:bg-gray-50 hover:text-gray-600"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => router.push('/sign-up')}
                  className="bg-gradient-to-r from-gray-600 to-gray-600 text-white shadow-lg shadow-gray-500/30 transition-all duration-300 hover:from-gray-700 hover:to-gray-700 hover:shadow-xl hover:shadow-gray-500/40"
                >
                  Get Started Free
                </Button>
              </>
            )}
          </div>
          <UserButton />

          {/* Mobile Menu Button */}
          <button
            className="text-gray-700 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mt-4 space-y-3 pb-4 md:hidden">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className="block w-full py-2 text-left text-sm font-semibold text-gray-700 hover:text-gray-600"
              >
                {item.label}
              </button>
            ))}
            <div className="space-y-2 pt-4">
              {isSignedIn ? (
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => router.push('/sign-in')}
                    className="w-full text-gray-700 hover:bg-gray-50"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => router.push('/sign-up')}
                    className="w-full bg-gradient-to-r from-gray-600 to-purple-600"
                  >
                    Get Started Free
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
