"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ApiKeyAnalytics({
  params,
}: {
  params: { id: string };
}) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/usage/keys/${params.id}`)
      .then((r) => r.json())
      .then(setData);
  }, [params.id]);

  if (!data) {
    return <div className="text-slate-600">Loading analytics…</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">
        API Key Analytics
      </h1>

      {/* Requests per minute */}
      <Card>
        <CardHeader>
          <CardTitle>Requests (Last 60 Minutes)</CardTitle>
        </CardHeader>
        <CardContent className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.perMinute}>
              <XAxis dataKey="time" hide />
              <YAxis />
              <Tooltip />
              <Line
                dataKey="count"
                stroke="#0f172a"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Requests per day */}
      <Card>
        <CardHeader>
          <CardTitle>Requests (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.perDay}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0f172a" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Success / Failure */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Passed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {data.passFail.find((p: any) => p.passed)?.count ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {data.passFail.find((p: any) => !p.passed)?.count ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Latency */}
      <Card>
        <CardHeader>
          <CardTitle>Latency</CardTitle>
        </CardHeader>
        <CardContent className="flex space-x-12">
          <div>
            <div className="text-2xl font-bold">{data.latency.p95} ms</div>
            <p className="text-sm text-slate-500">P95</p>
          </div>
          <div>
            <div className="text-2xl font-bold">{data.latency.p99} ms</div>
            <p className="text-sm text-slate-500">P99</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
