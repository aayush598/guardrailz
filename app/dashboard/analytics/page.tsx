'use client';

import { useEffect, useState } from 'react';
import { UserButton } from '@clerk/nextjs';
import { 
  Shield, 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast, Toaster } from 'sonner';
import Link from 'next/link';

interface AnalyticsData {
  overview: {
    totalExecutions: number;
    totalPassed: number;
    totalFailed: number;
    avgExecutionTime: number;
    successRate: number;
    changeFromLastPeriod: {
      executions: number;
      successRate: number;
      avgTime: number;
    };
  };
  timeSeriesData: {
    date: string;
    executions: number;
    passed: number;
    failed: number;
    avgTime: number;
  }[];
  guardrailStats: {
    name: string;
    executions: number;
    failures: number;
    failureRate: number;
    avgExecutionTime: number;
  }[];
  profileStats: {
    name: string;
    executions: number;
    successRate: number;
  }[];
  hourlyDistribution: {
    hour: number;
    executions: number;
  }[];
  topErrors: {
    message: string;
    count: number;
    lastOccurred: string;
  }[];
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`/api/analytics?range=${timeRange}`);
      if (!res.ok) throw new Error('Failed to fetch analytics');
      const data = await res.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-16 w-16 text-slate-400 animate-pulse mx-auto mb-4" />
          <p className="text-lg text-slate-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    return (
      <span className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
        {Math.abs(change).toFixed(1)}%
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster />

      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4 group">
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                Analytics & Insights
              </h1>
              <p className="text-slate-600">
                Deep dive into your guardrails performance
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAnalytics}
                disabled={refreshing}
                className="border-slate-300"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>

              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px] border-slate-300">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" className="border-slate-300">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Activity className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600">Total Executions</p>
                <p className="text-3xl font-bold text-slate-900">
                  {formatNumber(analytics?.overview.totalExecutions || 0)}
                </p>
                {formatChange(analytics?.overview.changeFromLastPeriod.executions || 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-xl">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600">Success Rate</p>
                <p className="text-3xl font-bold text-green-600">
                  {analytics?.overview.successRate.toFixed(1) || 0}%
                </p>
                {formatChange(analytics?.overview.changeFromLastPeriod.successRate || 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600">Avg Response Time</p>
                <p className="text-3xl font-bold text-purple-600">
                  {analytics?.overview.avgExecutionTime || 0}ms
                </p>
                {formatChange(analytics?.overview.changeFromLastPeriod.avgTime || 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-red-100 p-3 rounded-xl">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600">Total Failures</p>
                <p className="text-3xl font-bold text-red-600">
                  {formatNumber(analytics?.overview.totalFailed || 0)}
                </p>
                <p className="text-sm text-slate-500">
                  {((analytics?.overview.totalFailed || 0) / (analytics?.overview.totalExecutions || 1) * 100).toFixed(1)}% of total
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white border border-slate-200 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="guardrails" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              <Shield className="h-4 w-4 mr-2" />
              Guardrails
            </TabsTrigger>
            <TabsTrigger value="profiles" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              <PieChart className="h-4 w-4 mr-2" />
              Profiles
            </TabsTrigger>
            <TabsTrigger value="errors" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Errors
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Time Series Chart Placeholder */}
              <Card className="lg:col-span-2 border-slate-200 bg-white shadow-sm">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle className="text-slate-900">Execution Trends</CardTitle>
                  <CardDescription>Daily execution statistics over time</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-80 flex items-center justify-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <div className="text-center text-slate-500">
                      <BarChart3 className="h-16 w-16 mx-auto mb-3 opacity-20" />
                      <p className="font-medium mb-1">Chart Visualization</p>
                      <p className="text-sm">Integrate recharts or Chart.js for detailed trends</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Peak Usage Hours */}
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle className="text-slate-900">Peak Usage Hours</CardTitle>
                  <CardDescription>Request distribution by hour</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {analytics?.hourlyDistribution?.slice(0, 8).map((hour) => (
                      <div key={hour.hour} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700">
                            {String(hour.hour).padStart(2, '0')}:00
                          </span>
                          <span className="font-semibold text-slate-900">
                            {formatNumber(hour.executions)}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-slate-800 to-slate-900 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${(hour.executions / Math.max(...(analytics?.hourlyDistribution?.map(h => h.executions) || [1]))) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Success vs Failure */}
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle className="text-slate-900">Success vs Failure</CardTitle>
                  <CardDescription>Overall execution results</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-600">Passed</p>
                            <p className="text-2xl font-bold text-green-600">
                              {formatNumber(analytics?.overview.totalPassed || 0)}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-green-600 text-white text-lg px-4 py-2">
                          {analytics?.overview.successRate.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-red-100 p-2 rounded-lg">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-600">Failed</p>
                            <p className="text-2xl font-bold text-red-600">
                              {formatNumber(analytics?.overview.totalFailed || 0)}
                            </p>
                          </div>
                        </div>
                        <Badge variant="destructive" className="text-lg px-4 py-2">
                          {(100 - (analytics?.overview.successRate || 0)).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Guardrails Tab */}
          <TabsContent value="guardrails" className="space-y-6">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-slate-900">Guardrail Performance</CardTitle>
                <CardDescription>Execution statistics by guardrail</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {analytics?.guardrailStats?.map((stat, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:bg-white hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-white p-2 rounded-lg border border-slate-200">
                            <Shield className="h-5 w-5 text-slate-700" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">{stat.name}</h4>
                            <p className="text-sm text-slate-600">
                              {formatNumber(stat.executions)} executions
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={stat.failureRate > 10 ? 'destructive' : 'default'}
                          className={stat.failureRate > 10 ? 'bg-red-600' : 'bg-slate-900'}
                        >
                          {stat.failureRate.toFixed(1)}% failure rate
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                          <p className="text-slate-600 mb-1">Failures</p>
                          <p className="font-bold text-red-600">{formatNumber(stat.failures)}</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                          <p className="text-slate-600 mb-1">Avg Time</p>
                          <p className="font-bold text-slate-900">{stat.avgExecutionTime}ms</p>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg border border-slate-200">
                          <p className="text-slate-600 mb-1">Success</p>
                          <p className="font-bold text-green-600">
                            {(100 - stat.failureRate).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profiles Tab */}
          <TabsContent value="profiles" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analytics?.profileStats?.map((profile, idx) => (
                <Card key={idx} className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="border-b border-slate-100">
                    <CardTitle className="text-lg text-slate-900">{profile.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="text-center p-4 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-600 mb-1">Total Executions</p>
                      <p className="text-3xl font-bold text-slate-900">
                        {formatNumber(profile.executions)}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-600">Success Rate</span>
                        <span className="text-sm font-bold text-green-600">
                          {profile.successRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${profile.successRate}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Errors Tab */}
          <TabsContent value="errors" className="space-y-6">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-slate-900">Most Common Errors</CardTitle>
                <CardDescription>Frequently occurring validation failures</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {!analytics?.topErrors || analytics.topErrors.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                    <p className="text-lg font-semibold text-slate-900 mb-2">No Errors Detected</p>
                    <p className="text-slate-600">All guardrails are performing perfectly!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {analytics.topErrors.map((error, idx) => (
                      <div
                        key={idx}
                        className="bg-red-50 border border-red-200 rounded-xl p-5 hover:bg-red-100 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="bg-red-100 p-2 rounded-lg">
                              <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                            <Badge variant="destructive" className="bg-red-600">
                              {error.count} occurrences
                            </Badge>
                          </div>
                          <span className="text-xs text-slate-600">
                            Last: {new Date(error.lastOccurred).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-900 font-medium">{error.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}