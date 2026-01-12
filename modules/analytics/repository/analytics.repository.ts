import { db } from '@/shared/db/client';
import { analyticsEvents } from '@/shared/db/schema';
import { AnalyticsEvent } from '../domain/analytics-event';

export class AnalyticsRepository {
  async insert(event: AnalyticsEvent) {
    await db.insert(analyticsEvents).values({
      eventId: event.eventId,
      eventType: event.eventType,

      userId: event.userId,
      apiKeyId: event.apiKeyId,
      profileId: event.profileId,

      payload: event.payload,
      createdAt: event.timestamp,
    });
  }
}
