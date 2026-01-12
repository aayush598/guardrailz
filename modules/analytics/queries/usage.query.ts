import { db } from '@/shared/db/client';
import { analyticsEvents } from '@/shared/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import { AnalyticsQuery } from '@/modules/analytics/domain/analytics-query';
import { AnalyticsEvent } from '@/modules/analytics/domain/analytics-event';
import { mapRowToAnalyticsEvent } from '@/modules/analytics/mappers/analytics.mapper';

export async function getUsageStats(query: AnalyticsQuery): Promise<AnalyticsEvent<unknown>[]> {
  const rows = await db
    .select()
    .from(analyticsEvents)
    .where(
      and(
        eq(analyticsEvents.userId, query.userId),
        gte(analyticsEvents.createdAt, query.from),
        lte(analyticsEvents.createdAt, query.to),
      ),
    );

  return rows.map(mapRowToAnalyticsEvent);
}
