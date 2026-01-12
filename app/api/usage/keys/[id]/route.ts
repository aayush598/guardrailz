export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/shared/db/client';
import { users, rateLimitTracking, guardrailExecutions } from '@/shared/db/schema';
import { eq, and, gte, sql } from 'drizzle-orm';

/* ---------------- helper ---------------- */

async function getOrCreateUser(clerkUser: any) {
  const [u] = await db.select().from(users).where(eq(users.id, clerkUser.id)).limit(1);

  if (u) return u;

  const [created] = await db
    .insert(users)
    .values({
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
    })
    .returning();

  return created;
}

/* ---------------- route ---------------- */

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getOrCreateUser(clerkUser);
  const apiKeyId = params.id;

  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);

  /* ---------- 1. Requests per minute (last 60 min) ---------- */
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
        gte(rateLimitTracking.windowStart, oneHourAgo),
      ),
    )
    .orderBy(rateLimitTracking.windowStart);

  /* ---------- 2. Requests per hour (last 24h) ---------- */
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
        gte(rateLimitTracking.windowStart, oneDayAgo),
      ),
    )
    .groupBy(sql`1`)
    .orderBy(sql`1`);

  /* ---------- 3. Requests per day (last 7d) ---------- */
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
        gte(rateLimitTracking.windowStart, sevenDaysAgo),
      ),
    )
    .orderBy(rateLimitTracking.windowStart);

  /* ---------- 4. Success vs failure (24h) ---------- */
  const successFailure = await db
    .select({
      passed: guardrailExecutions.passed,
      count: sql<number>`count(*)`,
    })
    .from(guardrailExecutions)
    .where(
      and(
        eq(guardrailExecutions.apiKeyId, apiKeyId),
        gte(guardrailExecutions.createdAt, oneDayAgo),
      ),
    )
    .groupBy(guardrailExecutions.passed);

  /* ---------- 5. Latency percentiles ---------- */
  const latency = await db
    .select({
      p50: sql<number>`percentile_cont(0.5) within group (order by execution_time_ms)`,
      p95: sql<number>`percentile_cont(0.95) within group (order by execution_time_ms)`,
      p99: sql<number>`percentile_cont(0.99) within group (order by execution_time_ms)`,
    })
    .from(guardrailExecutions)
    .where(eq(guardrailExecutions.apiKeyId, apiKeyId));

  return NextResponse.json({
    perMinute,
    perHour,
    perDay,
    successFailure,
    latency: latency[0] ?? { p50: 0, p95: 0, p99: 0 },
  });
}
