import { ProfileDescriptor } from '../domain/profile-descriptor';

export const DefaultProfile: ProfileDescriptor = {
  name: 'default',
  description: 'Baseline security and safety guardrails',

  inputGuardrails: [
    { name: 'SecretsInInput', config: { severity: 'critical' } },
    { name: 'InputSize', config: { maxChars: 50_000 } },
    {
      name: 'NSFWAdvanced',
      config: {
        severityThreshold: 2,
        enableContextAnalysis: true,
        allowMedicalEducational: true,
        enableObfuscationDetection: true,
        minConfidence: 0.7,
      },
    },
  ],

  outputGuardrails: [{ name: 'OutputPIIRedaction' }],
  toolGuardrails: [],
};
