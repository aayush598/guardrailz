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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-slate-600 mb-8">Monitor guardrail performance and usage</p>

        {/* Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Executions" value={stats.totalExecutions} icon={<Activity />} />
          <StatCard title="Last 24 Hours" value={stats.last24Hours} icon={<TrendingUp />} />
          <StatCard title="Success Rate" value={`${successRate}%`} icon={<CheckCircle2 />} />
          <StatCard title="Avg Response Time" value={`${stats.avgExecutionTime}ms`} icon={<Zap />} />
        </div>

        {/* Rate Limits + Actions */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Rate Limits</span>
              </CardTitle>
              <CardDescription>Usage vs limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage resources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <QuickLink href="/dashboard/api-keys" label={`API Keys (${stats.apiKeysCount})`} icon={<Key />} />
              <QuickLink href="/dashboard/profiles" label={`Profiles (${stats.profilesCount})`} icon={<FileCode />} />
              <QuickLink href="/dashboard/playground" label="Test Playground" icon={<Activity />} />
            </CardContent>
          </Card>
        </div>

        {/* Activity + Failures */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.recentActivity.map((a, i) => (
                <div key={i} className="flex justify-between p-3 bg-slate-50 rounded">
                  <div className="flex items-center space-x-2">
                    {a.passed ? <CheckCircle2 className="text-green-600" /> : <XCircle className="text-red-600" />}
                    <span>{a.profileName}</span>
                  </div>
                  <span>{a.executionTime}ms</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Top Failed Guardrails</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.topFailedGuardrails.map((g, i) => (
                <div key={i} className="flex justify-between p-3 bg-slate-50 rounded">
                  <span>{g.name}</span>
                  <Badge variant="destructive">{g.count}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: any) {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row justify-between">
        <CardTitle className="text-sm">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="text-3xl font-bold">{value}</CardContent>
    </Card>
  );
}

function ProgressBar({ label, current, max }: any) {
  const pct = Math.min((current / max) * 100, 100);
  return (
    <div>
      <div className="flex justify-between mb-1 text-sm">
        <span>{label}</span>
        <span>{current} / {max}</span>
      </div>
      <div className="h-2 bg-slate-200 rounded">
        <div className="h-2 bg-indigo-600 rounded" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function QuickLink({ href, label, icon }: any) {
  return (
    <Button asChild className="w-full justify-between">
      <Link href={href}>
        <span className="flex items-center space-x-2">
          {icon}
          <span>{label}</span>
        </span>
        <ArrowUpRight />
      </Link>
    </Button>
  );
}
