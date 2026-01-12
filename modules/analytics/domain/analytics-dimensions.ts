export interface AnalyticsDimensions {
  userId: string;
  profileId?: string;
  apiKeyId?: string;

  guardrailName?: string;
  validationType?: 'input' | 'output' | 'tool';
}
