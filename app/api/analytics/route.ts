export const dynamic = 'force-dynamic';

import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/shared/db/client';
import { guardrailExecutions, profiles } from '@/shared/db/schema';
import { eq, and, gte, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';

    // Calculate time boundaries based on range
    const now = new Date();
    let startDate: Date;

    switch (range) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Get executions for the period
    const executions = await db
      .select()
      .from(guardrailExecutions)
      .where(
        and(eq(guardrailExecutions.userId, userId), gte(guardrailExecutions.createdAt, startDate)),
      );

    // Calculate overview stats
    const totalExecutions = executions.length;
    const totalPassed = executions.filter((e) => e.passed).length;
    const totalFailed = executions.filter((e) => !e.passed).length;
    const avgExecutionTime =
      totalExecutions > 0
        ? Math.round(executions.reduce((sum, e) => sum + e.executionTimeMs, 0) / totalExecutions)
        : 0;
    const successRate = totalExecutions > 0 ? (totalPassed / totalExecutions) * 100 : 0;

    // Calculate change from previous period (mock data for now)
    const changeFromLastPeriod = {
      executions: 12.5,
      successRate: 3.2,
      avgTime: -5.8,
    };

    // Time series data (group by day)
    const timeSeriesMap = new Map<
      string,
      {
        executions: number;
        passed: number;
        failed: number;
        totalTime: number;
      }
    >();

    executions.forEach((execution) => {
      const date = execution.createdAt.toISOString().split('T')[0];
      const current = timeSeriesMap.get(date) || {
        executions: 0,
        passed: 0,
        failed: 0,
        totalTime: 0,
      };

      current.executions++;
      if (execution.passed) current.passed++;
      else current.failed++;
      current.totalTime += execution.executionTimeMs;

      timeSeriesMap.set(date, current);
    });

    const timeSeriesData = Array.from(timeSeriesMap.entries())
      .map(([date, data]) => ({
        date,
        executions: data.executions,
        passed: data.passed,
        failed: data.failed,
        avgTime: Math.round(data.totalTime / data.executions),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Guardrail statistics
    const guardrailStatsMap = new Map<
      string,
      {
        executions: number;
        failures: number;
        totalTime: number;
      }
    >();

    executions.forEach((execution) => {
      const results = execution.guardrailResults as any[];
      results?.forEach((result: any) => {
        const current = guardrailStatsMap.get(result.guardrailName) || {
          executions: 0,
          failures: 0,
          totalTime: 0,
        };

        current.executions++;
        if (!result.passed) current.failures++;
        current.totalTime += execution.executionTimeMs / results.length;

        guardrailStatsMap.set(result.guardrailName, current);
      });
    });

    const guardrailStats = Array.from(guardrailStatsMap.entries())
      .map(([name, data]) => ({
        name,
        executions: data.executions,
        failures: data.failures,
        failureRate: (data.failures / data.executions) * 100,
        avgExecutionTime: Math.round(data.totalTime / data.executions),
      }))
      .sort((a, b) => b.executions - a.executions);

    // Profile statistics
    const profileStatsMap = new Map<
      string,
      {
        executions: number;
        passed: number;
      }
    >();

    executions.forEach((execution) => {
      const current = profileStatsMap.get(execution.profileId) || {
        executions: 0,
        passed: 0,
      };

      current.executions++;
      if (execution.passed) current.passed++;

      profileStatsMap.set(execution.profileId, current);
    });

    // Get profile names
    const profileIds = Array.from(profileStatsMap.keys());
    const profilesData = await db
      .select()
      .from(profiles)
      .where(
        sql`${profiles.id} IN (${sql.join(
          profileIds.map((id) => sql`${id}`),
          sql`, `,
        )})`,
      );

    const profileStats = Array.from(profileStatsMap.entries())
      .map(([profileId, data]) => {
        const profile = profilesData.find((p) => p.id === profileId);
        return {
          name: profile?.name || 'Unknown',
          executions: data.executions,
          successRate: (data.passed / data.executions) * 100,
        };
      })
      .sort((a, b) => b.executions - a.executions);

    // Hourly distribution
    const hourlyMap = new Map<number, number>();
    for (let i = 0; i < 24; i++) {
      hourlyMap.set(i, 0);
    }

    executions.forEach((execution) => {
      const hour = execution.createdAt.getHours();
      hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1);
    });

    const hourlyDistribution = Array.from(hourlyMap.entries())
      .map(([hour, executions]) => ({ hour, executions }))
      .sort((a, b) => b.executions - a.executions);

    // Top errors
    const errorMap = new Map<
      string,
      {
        count: number;
        lastOccurred: Date;
      }
    >();

    executions
      .filter((e) => !e.passed)
      .forEach((execution) => {
        const results = execution.guardrailResults as any[];
        results?.forEach((result: any) => {
          if (!result.passed) {
            const current = errorMap.get(result.message) || {
              count: 0,
              lastOccurred: execution.createdAt,
            };

            current.count++;
            if (execution.createdAt > current.lastOccurred) {
              current.lastOccurred = execution.createdAt;
            }

            errorMap.set(result.message, current);
          }
        });
      });

    const topErrors = Array.from(errorMap.entries())
      .map(([message, data]) => ({
        message,
        count: data.count,
        lastOccurred: data.lastOccurred.toISOString(),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      overview: {
        totalExecutions,
        totalPassed,
        totalFailed,
        avgExecutionTime,
        successRate,
        changeFromLastPeriod,
      },
      timeSeriesData,
      guardrailStats,
      profileStats,
      hourlyDistribution,
      topErrors,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
