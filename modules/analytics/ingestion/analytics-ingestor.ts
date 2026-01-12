import { AnalyticsEvent } from '../domain/analytics-event';
import { AnalyticsRepository } from '../repository/analytics.repository';
import { randomUUID } from 'crypto';

type IngestEventInput<TPayload> = {
  userId: string;
  apiKeyId?: string;
  profileId?: string;
  payload: TPayload;
};

export class AnalyticsIngestor {
  constructor(private readonly repo = new AnalyticsRepository()) {}

  async ingest<TPayload>(eventType: string, event: IngestEventInput<TPayload>) {
    const fullEvent: AnalyticsEvent<TPayload> = {
      eventId: randomUUID(),
      eventType,

      userId: event.userId,
      apiKeyId: event.apiKeyId,
      profileId: event.profileId,

      payload: event.payload,
      timestamp: new Date(),
    };

    await this.repo.insert(fullEvent);
  }
}
