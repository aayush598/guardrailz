import { AnalyticsIngestor } from '../ingestion/analytics-ingestor';
import {
  GUARDRAIL_EXECUTED_EVENT,
  GuardrailExecutedPayload,
} from '../events/guardrail-executed.event';

export class AnalyticsService {
  private readonly ingestor = new AnalyticsIngestor();

  async trackGuardrailExecution(params: {
    userId: string;
    apiKeyId?: string;
    profileId?: string;
    payload: GuardrailExecutedPayload;
  }) {
    await this.ingestor.ingest(GUARDRAIL_EXECUTED_EVENT, {
      userId: params.userId,
      apiKeyId: params.apiKeyId,
      profileId: params.profileId,
      payload: params.payload,
    });
  }
}
