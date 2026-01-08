"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const NavLink = ({
    href,
    icon: Icon,
    label,
    isActive = false,
  }: {
    href: string;
    icon: any;
    label: string;
    isActive?: boolean;
  }) => (
    <Link
      href={href}
      className={`
        group relative flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium
        transition-all duration-200
        ${isActive 
          ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg shadow-slate-900/20' 
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
        }
      `}
      onClick={() => setSidebarOpen(false)}
    >
      <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400'}`} />
      <span>{label}</span>
      {isActive && (
        <div className="absolute right-3">
          <ChevronRight className="h-4 w-4" />
        </div>
      )}
    </Link>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40 h-screen w-72 
          bg-white border-r border-slate-200 
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          shadow-xl lg:shadow-none
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-700 rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="relative bg-gradient-to-br from-slate-900 to-slate-700 p-2 rounded-xl shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Guardrailz
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden hover:bg-slate-100"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
            <div className="mb-4">
              <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Main
              </p>
              <NavLink href="/dashboard" icon={Home} label="Overview" isActive />
            </div>

            <div className="mb-4">
              <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Management
              </p>
              <NavLink href="/dashboard/api-keys" icon={Key} label="API Keys" />
              <NavLink href="/dashboard/profiles" icon={FileCode} label="Profiles" />
            </div>

            <div className="mb-4">
              <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Tools
              </p>
              <NavLink href="/dashboard/playground" icon={Activity} label="Playground" />
              <NavLink href="/dashboard/analytics" icon={BarChart3} label="Analytics" />
            </div>

            <div className="pt-4 border-t border-slate-200">
              <NavLink href="/dashboard/settings" icon={Settings} label="Settings" />
            </div>
          </nav>

          {/* Footer - Upgrade Card */}
          <div className="p-4 border-t border-slate-200">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
              <div className="relative">
                <p className="text-xs font-semibold mb-1 text-slate-300">Free Plan</p>
                <p className="text-sm font-bold mb-3">Upgrade to Pro</p>
                <Button size="sm" className="w-full bg-white text-slate-900 hover:bg-slate-100 font-semibold shadow-lg">
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
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-20 bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 py-3">
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
        <div className="flex-1 bg-slate-50">
          {children}
        </div>
      </main>
    </div>
  );
}