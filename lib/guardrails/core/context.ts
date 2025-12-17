export interface GuardrailContext {
  validationType?: 'input' | 'output';
  userId?: string;
  apiKeyId?: string;
  profileId?: string;

  // Optional advanced context
  ageVerified?: boolean;
  priorViolations?: number;

  // Tool-specific
  toolName?: string;
  toolArgs?: Record<string, any>;
}
