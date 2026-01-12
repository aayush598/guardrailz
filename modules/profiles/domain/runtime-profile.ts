import { GuardrailDescriptor } from '@/modules/guardrails/descriptors/types';

export interface RuntimeProfile {
  id: string;
  name: string;

  input: GuardrailDescriptor[];
  output: GuardrailDescriptor[];
  tool: GuardrailDescriptor[];
  all: GuardrailDescriptor[];
}
