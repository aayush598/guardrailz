export interface AnalyticsEvent<TPayload = unknown> {
  eventId: string;
  eventType: string;

  userId: string;
  apiKeyId?: string;
  profileId?: string;

  timestamp: Date;
  payload: TPayload;
}
