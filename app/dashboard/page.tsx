import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import {
  Shield,
  Key,
  FileCode,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  ArrowUpRight,
  BarChart3,
  ArrowRight,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getDashboardStats } from './stats';

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const successRate = stats.totalExecutions
    ? Math.round((stats.passedExecutions / stats.totalExecutions) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Dashboard Overview
            </h1>
            <UserButton afterSignOutUrl="/" />
          </div>
          <p className="text-slate-600">
            Monitor guardrail performance and usage in real-time
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Executions"
            value={stats.totalExecutions.toLocaleString()}
            icon={<Activity className="h-5 w-5" />}
            gradient="from-blue-500 to-blue-600"
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            title="Last 24 Hours"
            value={stats.last24Hours.toLocaleString()}
            icon={<TrendingUp className="h-5 w-5" />}
            gradient="from-purple-500 to-purple-600"
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />
          <StatCard
            title="Success Rate"
            value={`${successRate}%`}
            icon={<CheckCircle2 className="h-5 w-5" />}
            gradient="from-green-500 to-green-600"
            iconBg="bg-green-100"
            iconColor="text-green-600"
          />
          <StatCard
            title="Avg Response Time"
            value={`${stats.avgExecutionTime}ms`}
            icon={<Zap className="h-5 w-5" />}
            gradient="from-yellow-500 to-yellow-600"
            iconBg="bg-yellow-100"
            iconColor="text-yellow-600"
          />
        </div>

        {/* Rate Limits + Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Rate Limits Card */}
          <Card className="lg:col-span-2 border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center space-x-2 text-slate-900">
                <div className="bg-slate-100 p-2 rounded-lg">
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
                color="slate"
              />
              <ProgressBar
                label="Requests per Day"
                current={stats.rateLimits.perDay.current}
                max={stats.rateLimits.perDay.max}
                color="slate"
              />
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
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
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center space-x-2 text-slate-900">
                <div className="bg-slate-100 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-slate-700" />
                </div>
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>Latest guardrail executions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              {stats.recentActivity.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Activity className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No recent activity</p>
                </div>
              ) : (
                stats.recentActivity.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200"
                  >
                    <div className="flex items-center space-x-3">
                      {a.passed ? (
                        <div className="bg-green-100 p-2 rounded-lg">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </div>
                      ) : (
                        <div className="bg-red-100 p-2 rounded-lg">
                          <XCircle className="h-4 w-4 text-red-600" />
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-slate-900 text-sm">
                          {a.profileName}
                        </span>
                        <p className="text-xs text-slate-500">
                          {a.passed ? 'Passed' : 'Failed'}
                        </p>
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
          <Card className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="flex items-center space-x-2 text-slate-900">
                <div className="bg-red-100 p-2 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <span>Top Failed Guardrails</span>
              </CardTitle>
              <CardDescription>Most frequent failures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              {stats.topFailedGuardrails.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-20 text-green-500" />
                  <p className="text-sm">No failures detected</p>
                </div>
              ) : (
                stats.topFailedGuardrails.map((g, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200 hover:bg-red-100 transition-colors"
                  >
                    <span className="font-medium text-slate-900 text-sm">
                      {g.name}
                    </span>
                    <Badge
                      variant="destructive"
                      className="font-semibold bg-red-600"
                    >
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

function StatCard({ title, value, icon, gradient, iconBg, iconColor }: any) {
  return (
    <Card className="border-slate-200 bg-white hover:shadow-lg transition-all duration-300 group">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`${iconBg} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
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

function ProgressBar({ label, current, max, color = 'slate' }: any) {
  const pct = Math.min((current / max) * 100, 100);
  const isNearLimit = pct >= 80;

  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-600 font-mono">
          {current.toLocaleString()} / {max.toLocaleString()}
        </span>
      </div>
      <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
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
        <p className="text-xs text-red-600 mt-1 font-medium">
          ⚠️ Approaching rate limit
        </p>
      )}
    </div>
  );
}

function QuickLink({ href, label, icon }: any) {
  return (
    <Button
      asChild
      className="w-full justify-between text-sm font-medium hover:bg-slate-100 group"
      variant="ghost"
    >
      <Link href={href}>
        <span className="flex items-center gap-2">
          {icon}
          {label}
        </span>
        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </Button>
  );
}