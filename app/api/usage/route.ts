export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/shared/db/client';
import { users, guardrailExecutions, userRateLimits, rateLimitTracking } from '@/shared/db/schema';
import { eq, and, desc, gte, sql } from 'drizzle-orm';

// Helper to get or create user
async function getOrCreateUser(clerkUser: any) {
  const [existingUser] = await db.select().from(users).where(eq(users.id, clerkUser.id)).limit(1);

  if (existingUser) {
    return existingUser;
  }

  const [newUser] = await db
    .insert(users)
    .values({
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
    })
    .returning();

  return newUser;
}

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await getOrCreateUser(user);

    // Get total executions
    const totalExecutionsResult = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(guardrailExecutions)
      .where(eq(guardrailExecutions.userId, dbUser.id));

    const totalExecutions = Number(totalExecutionsResult[0]?.count || 0);

    // Get executions in last 24 hours
    const oneDayAgo = new Date(Date.now() - 86400000);
    const last24HoursResult = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(guardrailExecutions)
      .where(
        and(
          eq(guardrailExecutions.userId, dbUser.id),
          gte(guardrailExecutions.createdAt, oneDayAgo),
        ),
      );

    const last24Hours = Number(last24HoursResult[0]?.count || 0);

    // Get pass/fail stats
    const passedExecutionsResult = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(guardrailExecutions)
      .where(and(eq(guardrailExecutions.userId, dbUser.id), eq(guardrailExecutions.passed, true)));

    const passedExecutions = Number(passedExecutionsResult[0]?.count || 0);

    // Get recent executions
    const recentExecutions = await db
      .select()
      .from(guardrailExecutions)
      .where(eq(guardrailExecutions.userId, dbUser.id))
      .orderBy(desc(guardrailExecutions.createdAt))
      .limit(10);

    // Get user rate limits
    let [userLimit] = await db
      .select()
      .from(userRateLimits)
      .where(eq(userRateLimits.userId, dbUser.id))
      .limit(1);

    // Create default if doesn't exist
    if (!userLimit) {
      [userLimit] = await db
        .insert(userRateLimits)
        .values({
          userId: dbUser.id,
          requestsPerMinute: 500,
          requestsPerDay: 50000,
        })
        .returning();
    }

    // Get current rate limit usage
    const now = new Date();
    const minuteStart = new Date(now.getTime() - 60000);
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const minuteUsage = await db
      .select()
      .from(rateLimitTracking)
      .where(
        and(
          eq(rateLimitTracking.userId, dbUser.id),
          eq(rateLimitTracking.windowType, 'minute'),
          gte(rateLimitTracking.windowStart, minuteStart),
        ),
      );

    const dayUsage = await db
      .select()
      .from(rateLimitTracking)
      .where(
        and(
          eq(rateLimitTracking.userId, dbUser.id),
          eq(rateLimitTracking.windowType, 'day'),
          gte(rateLimitTracking.windowStart, dayStart),
        ),
      );

    const minuteCount = minuteUsage.reduce((sum, t) => sum + t.requestCount, 0);
    const dayCount = dayUsage.reduce((sum, t) => sum + t.requestCount, 0);

    return NextResponse.json({
      totalExecutions,
      last24Hours,
      passedExecutions,
      failedExecutions: totalExecutions - passedExecutions,
      recentExecutions,
      rateLimits: {
        perMinute: {
          current: minuteCount,
          max: userLimit?.requestsPerMinute || 500,
        },
        perDay: {
          current: dayCount,
          max: userLimit?.requestsPerDay || 50000,
        },
      },
    });
  } catch (error: any) {
    console.error('Usage error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage', details: error.message },
      { status: 500 },
    );
  }
}
