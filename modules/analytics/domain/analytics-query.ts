export interface AnalyticsQuery {
  userId: string;

  from: Date;
  to: Date;

  profileId?: string;
  apiKeyId?: string;
}
