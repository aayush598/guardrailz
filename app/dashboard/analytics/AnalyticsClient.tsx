'use client';

import {
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
} from 'lucide-react';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  hourlyDistribution: {
    hour: number;
    executions: number;
  }[];
  guardrailStats: any[];
  profileStats: any[];
  topErrors: any[];
}

export default function AnalyticsClient({
  analytics,
  range,
}: {
  analytics: AnalyticsData;
  range: string;
}) {
  const formatChange = (v: number) => {
    const up = v >= 0;
    return (
      <span className={`flex items-center text-sm font-medium ${up ? 'text-green-600' : 'text-red-600'}`}>
        {up ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
        {Math.abs(v).toFixed(1)}%
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/dashboard">
        <Button variant="ghost" size="sm" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Analytics & Insights
          </h1>
          <p className="text-slate-600">
            Performance metrics for your guardrails
          </p>
        </div>

        <Select
          value={range}
          onValueChange={(v) => {
            window.location.href = `/dashboard/analytics?range=${v}`;
          }}
        >
          <SelectTrigger className="w-[180px]">
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
      </div>

      {/* Overview */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Stat
          title="Total Executions"
          value={analytics.overview.totalExecutions}
          icon={<Activity className="h-5 w-5" />}
          change={formatChange(analytics.overview.changeFromLastPeriod.executions)}
        />
        <Stat
          title="Success Rate"
          value={`${analytics.overview.successRate.toFixed(1)}%`}
          icon={<CheckCircle2 className="h-5 w-5" />}
          change={formatChange(analytics.overview.changeFromLastPeriod.successRate)}
        />
        <Stat
          title="Avg Time"
          value={`${analytics.overview.avgExecutionTime}ms`}
          icon={<Clock className="h-5 w-5" />}
          change={formatChange(analytics.overview.changeFromLastPeriod.avgTime)}
        />
        <Stat
          title="Failures"
          value={analytics.overview.totalFailed}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="profiles">
            <PieChart className="h-4 w-4 mr-2" />
            Profiles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Execution Trends</CardTitle>
              <CardDescription>Aggregated statistics</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center text-slate-500">
              Chart integration placeholder
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Stat({
  title,
  value,
  icon,
  change,
}: {
  title: string;
  value: any;
  icon: React.ReactNode;
  change?: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between mb-4">
          <div className="bg-slate-100 p-3 rounded-xl">{icon}</div>
        </div>
        <p className="text-sm text-slate-600">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
        {change}
      </CardContent>
    </Card>
  );
}
