export interface GuardrailExecutedPayload {
  guardrailName: string;
  passed: boolean;
  severity: string;
  executionTimeMs: number;
}

export const GUARDRAIL_EXECUTED_EVENT = 'guardrail.executed';
