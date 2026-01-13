export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { requireAuth } from '@/shared/auth';
import { db } from '@/shared/db/client';
import { rateLimitTracking } from '@/shared/db/schema';
import { eq, and } from 'drizzle-orm';

function utcMinuteBucket(date: Date) {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      0,
      0,
    ),
  );
}

function utcDayBucket(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0),
  );
}

export async function GET() {
  const { dbUser } = await requireAuth();
  const now = new Date();

  const minuteBucket = utcMinuteBucket(now);
  const dayBucket = utcDayBucket(now);

  const rows = await db
    .select({
      apiKeyId: rateLimitTracking.apiKeyId,
      count: rateLimitTracking.requestCount,
      windowType: rateLimitTracking.windowType,
    })
    .from(rateLimitTracking)
    .where(
      and(
        eq(rateLimitTracking.userId, dbUser.id),
        eq(rateLimitTracking.windowStart, dayBucket), // covers day
      ),
    );

  const usageDay: Record<string, number> = {};
  const usageMinute: Record<string, number> = {};

  for (const row of rows) {
    if (row.windowType === 'day') {
      usageDay[row.apiKeyId] = row.count;
    }
  }

  const minuteRows = await db
    .select({
      apiKeyId: rateLimitTracking.apiKeyId,
      count: rateLimitTracking.requestCount,
    })
    .from(rateLimitTracking)
    .where(
      and(
        eq(rateLimitTracking.userId, dbUser.id),
        eq(rateLimitTracking.windowType, 'minute'),
        eq(rateLimitTracking.windowStart, minuteBucket),
      ),
    );

  for (const row of minuteRows) {
    usageMinute[row.apiKeyId] = row.count;
  }

  return NextResponse.json({
    perDay: usageDay,
    perMinute: usageMinute,
  });
}
