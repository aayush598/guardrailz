import { AnalyticsEvent } from '../domain/analytics-event';
import { AnalyticsEventRow } from '../repository/analytics-row';

export function mapRowToAnalyticsEvent<TPayload>(row: AnalyticsEventRow): AnalyticsEvent<TPayload> {
  return {
    eventId: row.eventId,
    eventType: row.eventType,

    userId: row.userId,
    apiKeyId: row.apiKeyId ?? undefined,
    profileId: row.profileId ?? undefined,

    payload: row.payload as TPayload,
    timestamp: row.createdAt,
  };
}
