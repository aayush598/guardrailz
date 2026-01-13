export interface GuardrailDescriptor {
  name: string;
  config?: unknown;
}

export interface GuardrailResult {
  guardrailName: string;
  passed: boolean;
  severity?: string;
  message?: string;
}
