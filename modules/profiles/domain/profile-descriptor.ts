import { GuardrailDescriptor } from '@/modules/guardrails/descriptors/types';

export interface ProfileDescriptor {
  name: string;
  description?: string;

  inputGuardrails: GuardrailDescriptor[];
  outputGuardrails: GuardrailDescriptor[];
  toolGuardrails: GuardrailDescriptor[];
}
