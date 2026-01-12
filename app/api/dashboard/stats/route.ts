export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { requireAuth } from '@/shared/auth';
import { getUsageStats } from '@/modules/analytics/queries/usage.query';
import { isGuardrailExecutedEvent } from '@/modules/analytics/utils/type-guards';

export async function GET() {
  try {
    const { dbUser } = await requireAuth();

    const now = new Date();
    const last24h = new Date(now.getTime() - 86400000);
    const last7d = new Date(now.getTime() - 7 * 86400000);

    const allEvents = await getUsageStats({
      userId: dbUser.id,
      from: new Date(0),
      to: now,
    });

    // 🔒 Narrow to guardrail execution events
    const guardrailEvents = allEvents.filter(isGuardrailExecutedEvent);

    const last24 = guardrailEvents.filter((e) => e.timestamp >= last24h);
    const last7 = guardrailEvents.filter((e) => e.timestamp >= last7d);

    const passed = guardrailEvents.filter((e) => e.payload.passed).length;

    const avgExecutionTime =
      guardrailEvents.length > 0
        ? Math.round(
            guardrailEvents.reduce((sum, e) => sum + e.payload.executionTimeMs, 0) /
              guardrailEvents.length,
          )
        : 0;

    return NextResponse.json({
      totalExecutions: guardrailEvents.length,
      last24Hours: last24.length,
      last7Days: last7.length,
      passedExecutions: passed,
      failedExecutions: guardrailEvents.length - passed,
      avgExecutionTime,
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    return NextResponse.json({ error: 'Failed to fetch dashboard statistics' }, { status: 500 });
  }
}
