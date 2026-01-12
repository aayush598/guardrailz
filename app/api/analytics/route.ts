export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/shared/auth';
import { getUsageStats } from '@/modules/analytics/queries/usage.query';
import { getGuardrailPerformance } from '@/modules/analytics/queries/guardrail-performance.query';
import { isGuardrailExecutedEvent } from '@/modules/analytics/utils/type-guards';

function resolveRange(range: string): Date {
  const now = Date.now();
  switch (range) {
    case '24h':
      return new Date(now - 24 * 60 * 60 * 1000);
    case '30d':
      return new Date(now - 30 * 24 * 60 * 60 * 1000);
    case '90d':
      return new Date(now - 90 * 24 * 60 * 60 * 1000);
    case '7d':
    default:
      return new Date(now - 7 * 24 * 60 * 60 * 1000);
  }
}

export async function GET(req: NextRequest) {
  try {
    const { dbUser } = await requireAuth();
    const range = new URL(req.url).searchParams.get('range') ?? '7d';

    const from = resolveRange(range);
    const to = new Date();

    const events = await getUsageStats({
      userId: dbUser.id,
      from,
      to,
    });

    const guardrailEvents = events.filter(isGuardrailExecutedEvent);

    const totalExecutions = guardrailEvents.length;
    const passed = guardrailEvents.filter((e) => e.payload.passed).length;
    const failed = totalExecutions - passed;

    const avgExecutionTime =
      totalExecutions > 0
        ? Math.round(
            guardrailEvents.reduce((sum, e) => sum + e.payload.executionTimeMs, 0) /
              totalExecutions,
          )
        : 0;

    const successRate = totalExecutions > 0 ? (passed / totalExecutions) * 100 : 0;

    const guardrailStats = await getGuardrailPerformance(dbUser.id);

    return NextResponse.json({
      overview: {
        totalExecutions,
        totalPassed: passed,
        totalFailed: failed,
        avgExecutionTime,
        successRate,
        changeFromLastPeriod: null,
      },
      guardrailStats,
    });
  } catch (err) {
    console.error('Analytics error:', err);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
