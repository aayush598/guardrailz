'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useUser, UserButton } from '@clerk/nextjs';
import { Shield, Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function MarketingNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn } = useUser();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isLanding = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Profiles', href: '#profiles' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Docs', href: '/docs' },
    {label: 'Hub', href: '/hub' },
  ];

  const navigate = (href: string) => {
    if (href.startsWith('#') && isLanding) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(href.startsWith('#') ? '/' : href);
    }
    setMobileMenuOpen(false);
  };

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
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-blue-100/50' : 'bg-white/50 backdrop-blur-sm'}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => router.push('/')}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-slate-500 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gray-700 p-2 rounded-xl">
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-gray-700 bg-clip-text text-transparent">
                Guardrailz
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="text-gray-700 hover:text-gray-900 transition-colors duration-200 text-sm font-semibold relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gray-800 to-gray-600 group-hover:w-full transition-all duration-300"></span>
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {isSignedIn ? (
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="bg-gradient-to-r from-gray-600 to-slate-700 hover:from-gray-700 hover:to-slate-700 text-white shadow-lg shadow-gray-500/30 hover:shadow-xl hover:shadow-gray-500/40 transition-all duration-300"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => router.push('/sign-in')}
                    className="text-gray-700 hover:text-gray-600 hover:bg-gray-50"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => router.push('/sign-up')}
                    className="bg-gradient-to-r from-gray-600 to-gray-600 hover:from-gray-700 hover:to-gray-700 text-white shadow-lg shadow-gray-500/30 hover:shadow-xl hover:shadow-gray-500/40 transition-all duration-300"
                  >
                    Get Started Free
                  </Button>
                </>
              )}
            </div>
            <UserButton />

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left text-gray-700 hover:text-gray-600 py-2 text-sm font-semibold"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 space-y-2">
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
