export interface AnalyticsEventRow {
  eventId: string;
  eventType: string;

  userId: string;
  apiKeyId: string | null;
  profileId: string | null;

  payload: unknown;
  createdAt: Date;
}
