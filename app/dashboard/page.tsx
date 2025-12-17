'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
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
  BarChart3
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';
import Link from 'next/link';

interface DashboardStats {
  totalExecutions: number;
  last24Hours: number;
  last7Days: number;
  passedExecutions: number;
  failedExecutions: number;
  avgExecutionTime: number;
  rateLimits: {
    perMinute: { current: number; max: number };
    perDay: { current: number; max: number };
  };
  recentActivity: {
    timestamp: string;
    profileName: string;
    passed: boolean;
    executionTime: number;
  }[];
  topFailedGuardrails: {
    name: string;
    count: number;
  }[];
  apiKeysCount: number;
  profilesCount: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch('/api/dashboard/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-indigo-600 animate-pulse mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const successRate = stats?.totalExecutions 
    ? Math.round((stats.passedExecutions / stats.totalExecutions) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Toaster />

      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-indigo-600 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Secure Agents
                </span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" className="text-indigo-600 font-medium" asChild>
                  <Link href="/dashboard">Overview</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard/api-keys">API Keys</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard/profiles">Profiles</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard/playground">Playground</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard/analytics">Analytics</Link>
                </Button>
              </nav>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Dashboard Overview
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Monitor your guardrails performance and usage in real-time
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Executions */}
          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-slate-200 dark:border-slate-800">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Executions
                </CardTitle>
                <Activity className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {stats?.totalExecutions.toLocaleString() || 0}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-500">All time</p>
            </CardContent>
          </Card>

          {/* Last 24 Hours */}
          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-slate-200 dark:border-slate-800">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Last 24 Hours
                </CardTitle>
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                {stats?.last24Hours.toLocaleString() || 0}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-500">
                {stats?.last7Days ? `${stats.last7Days.toLocaleString()} last 7 days` : 'Recent activity'}
              </p>
            </CardContent>
          </Card>

          {/* Success Rate */}
          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-slate-200 dark:border-slate-800">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Success Rate
                </CardTitle>
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                {successRate}%
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-500">
                {stats?.passedExecutions || 0} passed / {stats?.failedExecutions || 0} failed
              </p>
            </CardContent>
          </Card>

          {/* Avg Response Time */}
          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-slate-200 dark:border-slate-800">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Avg Response Time
                </CardTitle>
                <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                {stats?.avgExecutionTime || 0}ms
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-500">Per execution</p>
            </CardContent>
          </Card>
        </div>

        {/* Rate Limits & Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Rate Limits */}
          <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <span>Rate Limits</span>
              </CardTitle>
              <CardDescription>Current usage against your limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Per Minute */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Requests per Minute
                  </span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {stats?.rateLimits.perMinute.current || 0} / {stats?.rateLimits.perMinute.max || 100}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2.5 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        ((stats?.rateLimits.perMinute.current || 0) / 
                        (stats?.rateLimits.perMinute.max || 100)) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Per Day */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Requests per Day
                  </span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {stats?.rateLimits.perDay.current.toLocaleString() || 0} / {stats?.rateLimits.perDay.max.toLocaleString() || 10000}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-600 to-emerald-600 h-2.5 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        ((stats?.rateLimits.perDay.current || 0) / 
                        (stats?.rateLimits.perDay.max || 10000)) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your resources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-between bg-indigo-600 hover:bg-indigo-700 text-white"
                asChild
              >
                <Link href="/dashboard/api-keys">
                  <span className="flex items-center">
                    <Key className="h-4 w-4 mr-2" />
                    API Keys ({stats?.apiKeysCount || 0})
                  </span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button 
                className="w-full justify-between bg-purple-600 hover:bg-purple-700 text-white"
                asChild
              >
                <Link href="/dashboard/profiles">
                  <span className="flex items-center">
                    <FileCode className="h-4 w-4 mr-2" />
                    Profiles ({stats?.profilesCount || 0})
                  </span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button 
                className="w-full justify-between bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                asChild
              >
                <Link href="/dashboard/playground">
                  <span className="flex items-center">
                    <Activity className="h-4 w-4 mr-2" />
                    Test Playground
                  </span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Top Failed Guardrails */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>Latest guardrail executions</CardDescription>
            </CardHeader>
            <CardContent>
              {!stats?.recentActivity || stats.recentActivity.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <Activity className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No recent activity</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.recentActivity.slice(0, 5).map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        {activity.passed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {activity.profileName}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {activity.executionTime}ms
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Failed Guardrails */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <span>Top Failed Guardrails</span>
              </CardTitle>
              <CardDescription>Most frequently failing checks</CardDescription>
            </CardHeader>
            <CardContent>
              {!stats?.topFailedGuardrails || stats.topFailedGuardrails.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No failures detected</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.topFailedGuardrails.map((guardrail, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-sm font-bold text-red-600 dark:text-red-400">
                          {idx + 1}
                        </div>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {guardrail.name}
                        </span>
                      </div>
                      <Badge variant="destructive" className="font-mono">
                        {guardrail.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}