export const dynamic = 'force-dynamic';

import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/shared/db/client';
import { guardrailExecutions, apiKeys, profiles } from '@/shared/db/schema';
import { eq, and, gte, sql, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;

    // Calculate time boundaries
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Total executions
    const totalExecutionsResult = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(guardrailExecutions)
      .where(eq(guardrailExecutions.userId, userId));

    const totalExecutions = totalExecutionsResult[0]?.count || 0;

    // Last 24 hours
    const last24HoursResult = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(guardrailExecutions)
      .where(
        and(
          eq(guardrailExecutions.userId, userId),
          gte(guardrailExecutions.createdAt, last24Hours),
        ),
      );

    const last24HoursCount = last24HoursResult[0]?.count || 0;

    // Last 7 days
    const last7DaysResult = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(guardrailExecutions)
      .where(
        and(eq(guardrailExecutions.userId, userId), gte(guardrailExecutions.createdAt, last7Days)),
      );

    const last7DaysCount = last7DaysResult[0]?.count || 0;

    // Passed/Failed counts
    const passedResult = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(guardrailExecutions)
      .where(and(eq(guardrailExecutions.userId, userId), eq(guardrailExecutions.passed, true)));

    const passedExecutions = passedResult[0]?.count || 0;

    const failedResult = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(guardrailExecutions)
      .where(and(eq(guardrailExecutions.userId, userId), eq(guardrailExecutions.passed, false)));

    const failedExecutions = failedResult[0]?.count || 0;

    // Average execution time
    const avgTimeResult = await db
      .select({
        avgTime: sql<number>`cast(avg(${guardrailExecutions.executionTimeMs}) as int)`,
      })
      .from(guardrailExecutions)
      .where(eq(guardrailExecutions.userId, userId));

    const avgExecutionTime = avgTimeResult[0]?.avgTime || 0;

    // Recent activity (last 10 executions)
    const recentActivity = await db
      .select({
        timestamp: guardrailExecutions.createdAt,
        profileId: guardrailExecutions.profileId,
        passed: guardrailExecutions.passed,
        executionTime: guardrailExecutions.executionTimeMs,
      })
      .from(guardrailExecutions)
      .where(eq(guardrailExecutions.userId, userId))
      .orderBy(desc(guardrailExecutions.createdAt))
      .limit(10);

    // Get profile names for recent activity
    const activityWithProfiles = await Promise.all(
      recentActivity.map(async (activity) => {
        const profile = await db
          .select({ name: profiles.name })
          .from(profiles)
          .where(eq(profiles.id, activity.profileId))
          .limit(1);

        return {
          timestamp: activity.timestamp.toISOString(),
          profileName: profile[0]?.name || 'Unknown',
          passed: activity.passed,
          executionTime: activity.executionTime,
        };
      }),
    );

    // Top failed guardrails (from execution results JSON)
    const failedExecutionsData = await db
      .select({
        results: guardrailExecutions.guardrailResults,
      })
      .from(guardrailExecutions)
      .where(and(eq(guardrailExecutions.userId, userId), eq(guardrailExecutions.passed, false)))
      .limit(100);

    // Aggregate failed guardrails
    const failedGuardrailsMap = new Map<string, number>();

    failedExecutionsData.forEach((execution) => {
      const results = execution.results as any[];
      results?.forEach((result: any) => {
        if (!result.passed) {
          const count = failedGuardrailsMap.get(result.guardrailName) || 0;
          failedGuardrailsMap.set(result.guardrailName, count + 1);
        }
      });
    });

    const topFailedGuardrails = Array.from(failedGuardrailsMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Get API keys count
    const apiKeysResult = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(apiKeys)
      .where(and(eq(apiKeys.userId, userId), eq(apiKeys.isActive, true)));

    const apiKeysCount = apiKeysResult[0]?.count || 0;

    // Get profiles count
    const profilesResult = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(profiles)
      .where(eq(profiles.userId, userId));

    const profilesCount = profilesResult[0]?.count || 0;

    // Get rate limits (from first active API key)
    const userApiKeys = await db
      .select()
      .from(apiKeys)
      .where(and(eq(apiKeys.userId, userId), eq(apiKeys.isActive, true)))
      .limit(1);

    const rateLimits = {
      perMinute: {
        current: 0, // This would come from rate limit tracking
        max: userApiKeys[0]?.requestsPerMinute || 100,
      },
      perDay: {
        current: last24HoursCount,
        max: userApiKeys[0]?.requestsPerDay || 10000,
      },
    };

    return NextResponse.json({
      totalExecutions,
      last24Hours: last24HoursCount,
      last7Days: last7DaysCount,
      passedExecutions,
      failedExecutions,
      avgExecutionTime,
      rateLimits,
      recentActivity: activityWithProfiles,
      topFailedGuardrails,
      apiKeysCount,
      profilesCount,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard statistics' }, { status: 500 });
  }
}
