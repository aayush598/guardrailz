export interface GuardrailResult {
  passed: boolean;
  guardrailName: string;
  severity: GuardrailSeverity;
  action: GuardrailAction;
  message: string;
  details?: any;
  redactedText?: string;
}
