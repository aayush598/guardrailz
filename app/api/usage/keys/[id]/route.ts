import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import {
  users,
  rateLimitTracking,
  guardrailExecutions,
} from '@/lib/db/schema';
import { eq, and, gte, sql } from 'drizzle-orm';

async function getOrCreateUser(clerkUser: any) {
  const [user] = await db.select().from(users).where(eq(users.id, clerkUser.id));
  if (user) return user;

  const [created] = await db.insert(users).values({
    id: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
  }).returning();

  return created;
}

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await getOrCreateUser(clerkUser);
  const apiKeyId = params.id;

  /* ---------- REQUESTS / MINUTE (last 60) ---------- */
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

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

  /* ---------- REQUESTS / DAY (last 7) ---------- */
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);

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

  /* ---------- SUCCESS vs FAILURE ---------- */
  const passFail = await db
    .select({
      passed: guardrailExecutions.passed,
      count: sql<number>`count(*)`,
    })
    .from(guardrailExecutions)
    .where(
      and(
        eq(guardrailExecutions.apiKeyId, apiKeyId),
        eq(guardrailExecutions.userId, user.id)
      )
    )
    .groupBy(guardrailExecutions.passed);

  /* ---------- LATENCY ---------- */
  const latency = await db
    .select({
      p95: sql<number>`percentile_cont(0.95) within group (order by execution_time_ms)`,
      p99: sql<number>`percentile_cont(0.99) within group (order by execution_time_ms)`,
    })
    .from(guardrailExecutions)
    .where(eq(guardrailExecutions.apiKeyId, apiKeyId));

  return NextResponse.json({
    perMinute,
    perDay,
    passFail,
    latency: latency[0] ?? { p95: 0, p99: 0 },
  });
}
