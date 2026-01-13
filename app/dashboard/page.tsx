export const dynamic = 'force-dynamic';

import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import {
  Key,
  FileCode,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  BarChart3,
  ArrowRight,
} from 'lucide-react';
import type { ReactNode } from 'react';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { getDashboardStats } from './stats';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
}

interface ProgressBarProps {
  label: string;
  current: number;
  max: number;
}

interface QuickLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const successRate = stats.totalExecutions
    ? Math.round((stats.passedExecutions / stats.totalExecutions) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Dashboard Overview</h1>
            <UserButton afterSignOutUrl="/" />
          </div>
          <p className="text-slate-600">Monitor guardrail performance and usage in real-time</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Executions"
            value={stats.totalExecutions.toLocaleString()}
            icon={<Activity className="h-5 w-5" />}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            title="Last 24 Hours"
            value={stats.last24Hours.toLocaleString()}
            icon={<TrendingUp className="h-5 w-5" />}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />
          <StatCard
            title="Success Rate"
            value={`${successRate}%`}
            icon={<CheckCircle2 className="h-5 w-5" />}
            iconBg="bg-green-100"
            iconColor="text-green-600"
          />
          <StatCard
            title="Avg Response Time"
            value={`${stats.avgExecutionTime}ms`}
            icon={<Zap className="h-5 w-5" />}
            iconBg="bg-yellow-100"
            iconColor="text-yellow-600"
          />
        </div>

        {/* Rate Limits + Quick Actions */}
        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          {/* Rate Limits Card */}
          <Card className="border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md lg:col-span-2">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center space-x-2 text-slate-900">
                <div className="rounded-lg bg-slate-100 p-2">
                  <BarChart3 className="h-5 w-5 text-slate-700" />
                </div>
                <span>Rate Limits</span>
              </CardTitle>
              <CardDescription>Current usage vs your limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <ProgressBar
                label="Requests per Minute"
                current={stats.rateLimits.perMinute.current}
                max={stats.rateLimits.perMinute.max}
              />
              <ProgressBar
                label="Requests per Day"
                current={stats.rateLimits.perDay.current}
                max={stats.rateLimits.perDay.max}
              />
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-slate-900">Quick Actions</CardTitle>
              <CardDescription>Manage your resources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 pt-6">
              <QuickLink
                href="/dashboard/api-keys"
                label={`API Keys (${stats.apiKeysCount})`}
                icon={<Key className="h-4 w-4" />}
              />
              <QuickLink
                href="/dashboard/profiles"
                label={`Profiles (${stats.profilesCount})`}
                icon={<FileCode className="h-4 w-4" />}
              />
              <QuickLink
                href="/dashboard/playground"
                label="Test Playground"
                icon={<Activity className="h-4 w-4" />}
              />
              <QuickLink
                href="/dashboard/analytics"
                label="View Analytics"
                icon={<BarChart3 className="h-4 w-4" />}
              />
            </CardContent>
          </Card>
        </div>

        {/* Activity + Failures */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <Card className="border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center space-x-2 text-slate-900">
                <div className="rounded-lg bg-slate-100 p-2">
                  <Clock className="h-5 w-5 text-slate-700" />
                </div>
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>Latest guardrail executions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              {stats.recentActivity.length === 0 ? (
                <div className="py-8 text-center text-slate-500">
                  <Activity className="mx-auto mb-3 h-12 w-12 opacity-20" />
                  <p className="text-sm">No recent activity</p>
                </div>
              ) : (
                stats.recentActivity.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100"
                  >
                    <div className="flex items-center space-x-3">
                      {a.passed ? (
                        <div className="rounded-lg bg-green-100 p-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </div>
                      ) : (
                        <div className="rounded-lg bg-red-100 p-2">
                          <XCircle className="h-4 w-4 text-red-600" />
                        </div>
                      )}
                      <div>
                        <span className="text-sm font-medium text-slate-900">{a.profileName}</span>
                        <p className="text-xs text-slate-500">{a.passed ? 'Passed' : 'Failed'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="font-mono text-xs">
                        {a.executionTime}ms
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Top Failed Guardrails */}
          <Card className="border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center space-x-2 text-slate-900">
                <div className="rounded-lg bg-red-100 p-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <span>Top Failed Guardrails</span>
              </CardTitle>
              <CardDescription>Most frequent failures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              {stats.topFailedGuardrails.length === 0 ? (
                <div className="py-8 text-center text-slate-500">
                  <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-green-500 opacity-20" />
                  <p className="text-sm">No failures detected</p>
                </div>
              ) : (
                stats.topFailedGuardrails.map((g, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 transition-colors hover:bg-red-100"
                  >
                    <span className="text-sm font-medium text-slate-900">{g.name}</span>
                    <Badge variant="destructive" className="bg-red-600 font-semibold">
                      {g.count} failures
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, iconBg, iconColor }: StatCardProps) {
  return (
    <Card className="group border-slate-200 bg-white transition-all duration-300 hover:shadow-lg">
      <CardContent className="pt-6">
        <div className="mb-4 flex items-center justify-between">
          <div className={`${iconBg} rounded-xl p-3 transition-transform group-hover:scale-110`}>
            <div className={iconColor}>{icon}</div>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ProgressBar({ label, current, max }: ProgressBarProps) {
  const pct = Math.min((current / max) * 100, 100);
  const isNearLimit = pct >= 80;

  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="font-mono text-slate-600">
          {current.toLocaleString()} / {max.toLocaleString()}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${
            isNearLimit
              ? 'bg-gradient-to-r from-red-500 to-red-600'
              : 'bg-gradient-to-r from-slate-800 to-slate-900'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {isNearLimit && (
        <p className="mt-1 text-xs font-medium text-red-600">⚠️ Approaching rate limit</p>
      )}
    </div>
  );
}

function QuickLink({ href, label, icon }: QuickLinkProps) {
  return (
    <Button
      asChild
      className="group w-full justify-between text-sm font-medium hover:bg-slate-100"
      variant="ghost"
    >
      <Link href={href}>
        <span className="flex items-center gap-2">
          {icon}
          {label}
        </span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </Button>
  );
}
