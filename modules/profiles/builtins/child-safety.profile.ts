import { ProfileDescriptor } from '../domain/profile-descriptor';

export const ChildSafetyProfile: ProfileDescriptor = {
  name: 'child_safety',
  description: 'Maximum safety for children and education',

  inputGuardrails: [
    { name: 'SecretsInInput', config: { severity: 'critical' } },
    { name: 'InputSize', config: { maxChars: 30_000 } },
  ],

  outputGuardrails: [{ name: 'OutputPIIRedaction' }],
  toolGuardrails: [],
};
