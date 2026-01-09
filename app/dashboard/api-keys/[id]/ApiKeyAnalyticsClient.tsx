'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
  Cell,
} from 'recharts';

import {
  ArrowLeft,
  TrendingUp,
  Activity,
  Clock,
} from 'lucide-react';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ApiKeyAnalyticsClient({ data }: { data: any }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/api-keys">
            <Button variant="ghost" size="sm" className="mb-4 group">
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to API Keys
            </Button>
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                API Key Analytics
              </h1>
              <p className="text-slate-600">
                Detailed usage and performance metrics
              </p>
            </div>
            <Badge className="bg-slate-900 text-white">Live Data</Badge>
          </div>
        </div>

        {/* Traffic */}
        <Section title="Traffic Analysis" icon={<TrendingUp className="h-5 w-5" />}>
          <Chart title="Requests per Minute (Last 60 min)">
            <LineChart data={data.perMinute}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line dataKey="count" stroke="#0f172a" strokeWidth={3} dot={false} />
            </LineChart>
          </Chart>

          <Chart title="Requests per Hour (Last 24h)">
            <LineChart data={data.perHour}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line dataKey="count" stroke="#0f172a" strokeWidth={3} dot={false} />
            </LineChart>
          </Chart>

          <Chart title="Requests per Day (Last 7d)">
            <BarChart data={data.perDay}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0f172a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </Chart>
        </Section>

        {/* Reliability */}
        <Section title="Reliability" icon={<Activity className="h-5 w-5" />}>
          <Chart title="Success vs Failure (24h)">
            <BarChart
              data={data.successFailure.map((x: any) => ({
                name: x.passed ? 'Success' : 'Failure',
                value: x.count,
                passed: x.passed,
              }))}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {data.successFailure.map((e: any, i: number) => (
                  <Cell key={i} fill={e.passed ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </Chart>
        </Section>

        {/* Latency */}
        <Section title="Performance Metrics" icon={<Clock className="h-5 w-5" />}>
          <div className="grid md:grid-cols-3 gap-6">
            <Metric label="P50 Latency" value={`${data.latency.p50} ms`} />
            <Metric label="P95 Latency" value={`${data.latency.p95} ms`} />
            <Metric label="P99 Latency" value={`${data.latency.p99} ms`} />
          </div>
        </Section>
      </div>
    </div>
  );
}

/* ---------- UI HELPERS ---------- */

function Section({ title, icon, children }: any) {
  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-slate-900 p-2 rounded-lg text-white">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-6">{children}</div>
    </section>
  );
}

function Chart({ title, description, children }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          {children}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: any) {
  return (
    <Card>
      <CardContent className="pt-6 text-center">
        <p className="text-sm text-slate-600 mb-2">{label}</p>
        <p className="text-4xl font-bold text-slate-900">{value}</p>
      </CardContent>
    </Card>
  );
}
