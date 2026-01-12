import { AnalyticsEvent } from '../domain/analytics-event';
import {
  GUARDRAIL_EXECUTED_EVENT,
  GuardrailExecutedPayload,
} from '../events/guardrail-executed.event';

export function isGuardrailExecutedEvent(
  event: AnalyticsEvent<unknown>,
): event is AnalyticsEvent<GuardrailExecutedPayload> {
  return event.eventType === GUARDRAIL_EXECUTED_EVENT;
}
