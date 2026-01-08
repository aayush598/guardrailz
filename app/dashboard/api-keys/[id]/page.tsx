"use client";

import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  BarChart, Bar, ResponsiveContainer, Cell
} from "recharts";
import { ArrowLeft, TrendingUp, Activity, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const COLORS = ["#0f172a", "#cbd5e1"];

export default function ApiKeyAnalyticsPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/usage/keys/${params.id}`)
      .then(r => r.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 text-slate-400 animate-pulse mx-auto mb-4" />
          <p className="text-slate-600">Loading analytics…</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-slate-600">Failed to load analytics</p>
        </div>
      </div>
    );
  }

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

        {/* Traffic Section */}
        <Section title="Traffic Analysis" icon={<TrendingUp className="h-5 w-5" />}>
          <Chart title="Requests per Minute (Last 60 min)" description="Real-time request volume">
            <LineChart data={data.perMinute}>
              <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#64748b" />
              <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.75rem',
                }}
              />
              <Line
                dataKey="count"
                stroke="#0f172a"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#0f172a' }}
              />
            </LineChart>
          </Chart>

          <Chart title="Requests per Hour (Last 24h)" description="Hourly traffic patterns">
            <LineChart data={data.perHour}>
              <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#64748b" />
              <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.75rem',
                }}
              />
              <Line
                dataKey="count"
                stroke="#0f172a"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#0f172a' }}
              />
            </LineChart>
          </Chart>

          <Chart title="Requests per Day (Last 7d)" description="Daily request volume">
            <BarChart data={data.perDay}>
              <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#64748b" />
              <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.75rem',
                }}
              />
              <Bar dataKey="count" fill="#0f172a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </Chart>
        </Section>

        {/* Reliability Section */}
        <Section title="Reliability" icon={<Activity className="h-5 w-5" />}>
          <Chart title="Success vs Failure (24h)" description="Request outcome distribution">
            <BarChart
              data={data.successFailure.map((x: any) => ({
                name: x.passed ? "Success" : "Failure",
                value: x.count,
                passed: x.passed,
              }))}
            >
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#64748b" />
              <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.75rem',
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {data.successFailure.map((entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.passed ? "#10b981" : "#ef4444"}
                  />
                ))}
              </Bar>
            </BarChart>
          </Chart>
        </Section>

        {/* Latency Section */}
        <Section title="Performance Metrics" icon={<Clock className="h-5 w-5" />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Metric
              label="P50 Latency"
              value={`${data.latency.p50} ms`}
              description="Median response time"
              color="blue"
            />
            <Metric
              label="P95 Latency"
              value={`${data.latency.p95} ms`}
              description="95th percentile"
              color="purple"
            />
            <Metric
              label="P99 Latency"
              value={`${data.latency.p99} ms`}
              description="99th percentile"
              color="slate"
            />
          </div>
        </Section>
      </div>
    </div>
  );
}

/* ---------- UI COMPONENTS ---------- */

function Section({ title, icon, children }: any) {
  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-slate-900 p-2 rounded-lg">{icon}</div>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-6">{children}</div>
    </section>
  );
}

function Chart({ title, description, children }: any) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-lg text-slate-900">{title}</CardTitle>
        {description && (
          <CardDescription className="text-sm">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={280}>
          {children}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function Metric({ label, value, description, color }: any) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    slate: 'from-slate-500 to-slate-600',
  };

  return (
    <Card className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="text-center">
          <p className="text-sm font-medium text-slate-600 mb-3">{label}</p>
          <div
            className={`text-4xl font-bold bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} bg-clip-text text-transparent mb-2`}
          >
            {value}
          </div>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}