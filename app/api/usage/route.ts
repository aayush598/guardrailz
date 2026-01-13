export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { requireAuth } from '@/shared/auth';
import { getUsageStats } from '@/modules/analytics/queries/usage.query';
import { isGuardrailExecutedEvent } from '@/modules/analytics/utils/type-guards';

export async function GET() {
  try {
    const { dbUser } = await requireAuth();

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 86400000);

    const events = await getUsageStats({
      userId: dbUser.id,
      from: new Date(0),
      to: now,
    });

    const guardrailEvents = events.filter(isGuardrailExecutedEvent);

    const last24 = guardrailEvents.filter((e) => e.timestamp >= oneDayAgo);

    const passed = guardrailEvents.filter((e) => e.payload.passed).length;

    return NextResponse.json({
      totalExecutions: guardrailEvents.length,
      last24Hours: last24.length,
      passedExecutions: passed,
      failedExecutions: guardrailEvents.length - passed,
    });
  } catch (err: unknown) {
    console.error(err);

    const message = err instanceof Error ? err.message : 'Unknown Usage error';

    return NextResponse.json({ error: 'Failed to fetch usage', details: message }, { status: 500 });
  }
}
