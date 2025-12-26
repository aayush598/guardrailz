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
  }: {
    href: string;
    icon: any;
    label: string;
  }) => (
    <Link
      href={href}
      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50"
      onClick={() => setSidebarOpen(false)}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-200 transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-2">
              <Shield className="h-7 w-7 text-slate-900" />
              <span className="text-lg font-bold">Guardrailz</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X />
            </Button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <NavLink href="/dashboard" icon={Home} label="Overview" />
            <NavLink href="/dashboard/api-keys" icon={Key} label="API Keys" />
            <NavLink href="/dashboard/profiles" icon={FileCode} label="Profiles" />
            <NavLink href="/dashboard/playground" icon={Activity} label="Playground" />
            <NavLink href="/dashboard/analytics" icon={BarChart3} label="Analytics" />
            <NavLink href="/dashboard/settings" icon={Settings} label="Settings" />
          </nav>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Content */}
      <main className="flex-1 bg-slate-50 overflow-y-auto">
        <div className="sticky top-0 z-20 bg-white border-b px-6 py-4 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden mr-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu />
          </Button>
          <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
        </div>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
