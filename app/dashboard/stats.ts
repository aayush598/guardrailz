// app/dashboard/stats.ts
import { currentUser } from '@clerk/nextjs/server';
import { unstable_cache } from 'next/cache';
import { db } from '@/lib/db';
import { guardrailExecutions, apiKeys, profiles } from '@/lib/db/schema';
import { and, desc, eq, gte, sql } from 'drizzle-orm';

/* ---------------- PUBLIC ENTRY ---------------- */

export async function getDashboardStats() {
  const user = await currentUser();
  if (!user) throw new Error('Unauthorized');

  return getDashboardStatsCached(user.id);
}

/* ---------------- CACHED CORE ---------------- */

const getDashboardStatsCached = unstable_cache(
  async (userId: string) => {
    const now = new Date();
    const last24h = new Date(now.getTime() - 86_400_000);
    const last7d = new Date(now.getTime() - 604_800_000);

    const [
      total,
      last24,
      last7,
      passed,
      failed,
      avgTime,
      apiKeyCount,
      profileCount,
      apiKey,
      recentActivity,
      failedExecutions,
    ] = await Promise.all([
      countExec(userId),
      countExec(userId, last24h),
      countExec(userId, last7d),
      countPassed(userId, true),
      countPassed(userId, false),
      avgExecTime(userId),
      countApiKeys(userId),
      countProfiles(userId),
      firstApiKey(userId),
      recentExec(userId),
      failedExec(userId),
    ]);

    /* Aggregate failed guardrails */
    const failedMap = new Map<string, number>();
    failedExecutions.forEach(e => {
      (e.guardrailResults as any[])?.forEach(r => {
        if (!r.passed) {
          failedMap.set(
            r.guardrailName,
            (failedMap.get(r.guardrailName) || 0) + 1
          );
        }
      });
    });

    return {
      totalExecutions: total,
      last24Hours: last24,
      last7Days: last7,
      passedExecutions: passed,
      failedExecutions: failed,
      avgExecutionTime: avgTime,
      apiKeysCount: apiKeyCount,
      profilesCount: profileCount,
      rateLimits: {
        perMinute: { current: 0, max: apiKey?.requestsPerMinute ?? 100 },
        perDay: { current: last24, max: apiKey?.requestsPerDay ?? 10_000 },
      },
      recentActivity: recentActivity.map(a => ({
        timestamp: a.timestamp.toISOString(),
        profileName: a.profileName ?? 'Unknown',
        passed: a.passed,
        executionTime: a.executionTime,
      })),
      topFailedGuardrails: [...failedMap.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
    };
  },
  ['dashboard-stats'], // base key
  { revalidate: 60 }
);

/* ---------------- HELPERS ---------------- */

const countExec = async (userId: string, since?: Date) =>
  (
    await db
      .select({ c: sql<number>`count(*)::int` })
      .from(guardrailExecutions)
      .where(
        since
          ? and(
              eq(guardrailExecutions.userId, userId),
              gte(guardrailExecutions.createdAt, since)
            )
          : eq(guardrailExecutions.userId, userId)
      )
  )[0].c;

const countPassed = async (userId: string, passed: boolean) =>
  (
    await db
      .select({ c: sql<number>`count(*)::int` })
      .from(guardrailExecutions)
      .where(
        and(
          eq(guardrailExecutions.userId, userId),
          eq(guardrailExecutions.passed, passed)
        )
      )
  )[0].c;

const avgExecTime = async (userId: string) =>
  (
    await db
      .select({
        a: sql<number>`coalesce(avg(${guardrailExecutions.executionTimeMs}),0)::int`,
      })
      .from(guardrailExecutions)
      .where(eq(guardrailExecutions.userId, userId))
  )[0].a;

const recentExec = async (userId: string) =>
  db
    .select({
      timestamp: guardrailExecutions.createdAt,
      passed: guardrailExecutions.passed,
      executionTime: guardrailExecutions.executionTimeMs,
      profileName: profiles.name,
    })
    .from(guardrailExecutions)
    .leftJoin(profiles, eq(guardrailExecutions.profileId, profiles.id))
    .where(eq(guardrailExecutions.userId, userId))
    .orderBy(desc(guardrailExecutions.createdAt))
    .limit(5);

const failedExec = async (userId: string) =>
  db
    .select({ guardrailResults: guardrailExecutions.guardrailResults })
    .from(guardrailExecutions)
    .where(
      and(
        eq(guardrailExecutions.userId, userId),
        eq(guardrailExecutions.passed, false)
      )
    )
    .limit(50);

const countApiKeys = async (userId: string) =>
  (
    await db
      .select({ c: sql<number>`count(*)::int` })
      .from(apiKeys)
      .where(
        and(eq(apiKeys.userId, userId), eq(apiKeys.isActive, true))
      )
  )[0].c;

const countProfiles = async (userId: string) =>
  (
    await db
      .select({ c: sql<number>`count(*)::int` })
      .from(profiles)
      .where(eq(profiles.userId, userId))
  )[0].c;

const firstApiKey = async (userId: string) =>
  (
    await db
      .select()
      .from(apiKeys)
      .where(
        and(eq(apiKeys.userId, userId), eq(apiKeys.isActive, true))
      )
      .limit(1)
  )[0];
