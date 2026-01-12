import { ProfileDescriptor } from '../domain/profile-descriptor';

export const EnterpriseSecurityProfile: ProfileDescriptor = {
  name: 'enterprise_security',
  description: 'Enterprise-grade security with strict controls',

  inputGuardrails: [
    { name: 'SecretsInInput', config: { severity: 'critical' } },
    { name: 'InputSize', config: { maxChars: 25_000 } },
  ],

  outputGuardrails: [{ name: 'OutputPIIRedaction' }],
  toolGuardrails: [],
};
