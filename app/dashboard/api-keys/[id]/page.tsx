import { currentUser } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { rateLimitTracking, guardrailExecutions } from '@/lib/db/schema';
import { and, eq, gte, sql } from 'drizzle-orm';
import ApiKeyAnalyticsClient from './ApiKeyAnalyticsClient';

export default async function ApiKeyAnalyticsPage({
  params,
}: {
  params: { id: string };
}) {
  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error('Unauthorized');

  const apiKeyId = params.id;

  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);

  /* ---------- Requests per minute ---------- */
  const perMinute = await db
    .select({
      time: rateLimitTracking.windowStart,
      count: rateLimitTracking.requestCount,
    })
    .from(rateLimitTracking)
    .where(
      and(
        eq(rateLimitTracking.apiKeyId, apiKeyId),
        eq(rateLimitTracking.windowType, 'minute'),
        gte(rateLimitTracking.windowStart, oneHourAgo)
      )
    )
    .orderBy(rateLimitTracking.windowStart);

  /* ---------- Requests per hour ---------- */
  const perHour = await db
    .select({
      time: sql<Date>`date_trunc('hour', ${rateLimitTracking.windowStart})`,
      count: sql<number>`sum(${rateLimitTracking.requestCount})::int`,
    })
    .from(rateLimitTracking)
    .where(
      and(
        eq(rateLimitTracking.apiKeyId, apiKeyId),
        eq(rateLimitTracking.windowType, 'minute'),
        gte(rateLimitTracking.windowStart, oneDayAgo)
      )
    )
    .groupBy(sql`1`)
    .orderBy(sql`1`);

  /* ---------- Requests per day ---------- */
  const perDay = await db
    .select({
      time: rateLimitTracking.windowStart,
      count: rateLimitTracking.requestCount,
    })
    .from(rateLimitTracking)
    .where(
      and(
        eq(rateLimitTracking.apiKeyId, apiKeyId),
        eq(rateLimitTracking.windowType, 'day'),
        gte(rateLimitTracking.windowStart, sevenDaysAgo)
      )
    )
    .orderBy(rateLimitTracking.windowStart);

  /* ---------- Success vs failure ---------- */
  const successFailure = await db
    .select({
      passed: guardrailExecutions.passed,
      count: sql<number>`count(*)`,
    })
    .from(guardrailExecutions)
    .where(
      and(
        eq(guardrailExecutions.apiKeyId, apiKeyId),
        gte(guardrailExecutions.createdAt, oneDayAgo)
      )
    )
    .groupBy(guardrailExecutions.passed);

  /* ---------- Latency ---------- */
  const [latency] = await db
    .select({
      p50: sql<number>`percentile_cont(0.5) within group (order by execution_time_ms)`,
      p95: sql<number>`percentile_cont(0.95) within group (order by execution_time_ms)`,
      p99: sql<number>`percentile_cont(0.99) within group (order by execution_time_ms)`,
    })
    .from(guardrailExecutions)
    .where(eq(guardrailExecutions.apiKeyId, apiKeyId));

  return (
    <ApiKeyAnalyticsClient
      data={{
        perMinute,
        perHour,
        perDay,
        successFailure,
        latency: latency ?? { p50: 0, p95: 0, p99: 0 },
      }}
    />
  );
}
