'use client';

import { useState } from 'react';
import {
  Shield,
  Home,
  Key,
  FileCode,
  Activity,
  BarChart3,
  Settings,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const NavLink = ({
    href,
    icon: Icon,
    label,
  }: {
    href: string;
    icon: LucideIcon;
    label: string;
  }) => {
    const active = isActiveRoute(href);

    return (
      <Link
        href={href}
        prefetch
        className={`group relative flex items-center space-x-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
          active
            ? 'bg-slate-700 text-white shadow-lg shadow-slate-900/20'
            : 'text-slate-600 hover:bg-slate-100 hover:pl-4 hover:text-slate-900'
        } `}
        onClick={() => setSidebarOpen(false)}
      >
        <Icon
          className={`h-5 w-5 transition-transform group-hover:scale-110 ${
            active ? 'text-white' : 'text-slate-400'
          }`}
        />
        <span>{label}</span>
        {active && (
          <div className="absolute right-3">
            <ChevronRight className="h-4 w-4" />
          </div>
        )}
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-72 border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:sticky lg:transition-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-xl lg:translate-x-0 lg:shadow-none`}
      >
        <div className="flex h-full flex-col">
          {/* Logo Header */}
          <div className="flex items-center justify-between border-b border-slate-200 p-6">
            <Link href="/" className="group flex cursor-pointer items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 opacity-40 blur-md transition-opacity group-hover:opacity-60" />
                <div className="relative rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 p-2 shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-xl font-bold text-transparent">
                Guardrailz
              </span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-slate-100 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
            <div className="mb-4">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Main
              </p>
              <NavLink href="/dashboard" icon={Home} label="Overview" />
            </div>

            <div className="mb-4">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Management
              </p>
              <NavLink href="/dashboard/api-keys" icon={Key} label="API Keys" />
              <NavLink href="/dashboard/profiles" icon={FileCode} label="Profiles" />
            </div>

            <div className="mb-4">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Tools
              </p>
              <NavLink href="/dashboard/playground" icon={Activity} label="Playground" />
              <NavLink href="/dashboard/analytics" icon={BarChart3} label="Analytics" />
            </div>

            <div className="border-t border-slate-200 pt-4">
              <NavLink href="/dashboard/settings" icon={Settings} label="Settings" />
            </div>
          </nav>

          {/* Footer - Upgrade Card */}
          <div className="border-t border-slate-200 p-4">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-700 to-slate-600 p-4 text-white">
              <div className="absolute right-0 top-0 -mr-10 -mt-10 h-20 w-20 rounded-full bg-white/10" />
              <div className="relative">
                <p className="mb-1 text-xs font-semibold text-slate-300">Free Plan</p>
                <p className="mb-3 text-sm font-bold">Upgrade to Pro</p>
                <Button
                  size="sm"
                  className="w-full bg-white font-semibold text-slate-900 shadow-lg hover:bg-slate-100"
                >
                  Upgrade Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex min-h-screen flex-1 flex-col">
        {/* Mobile Header */}
        <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="hover:bg-slate-100"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-slate-900" />
              <span className="font-bold text-slate-900">Guardrailz</span>
            </div>
            <div className="w-10" />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-slate-50">{children}</div>
      </main>
    </div>
  );
}
