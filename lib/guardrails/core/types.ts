export type GuardrailStage = 'input' | 'output' | 'tool' | 'general';

export type GuardrailAction =
  | 'ALLOW'
  | 'WARN'
  | 'BLOCK'
  | 'MODIFY';

export type GuardrailSeverity =
  | 'info'
  | 'warning'
  | 'error'
  | 'critical';
