import { RuntimeProfile } from '../domain/runtime-profile';
import { normalizeDescriptor } from '@/modules/guardrails/descriptors/normalize';

export function compileProfile(profile: {
  id: string;
  name: string;
  inputGuardrails: unknown[];
  outputGuardrails: unknown[];
  toolGuardrails: unknown[];
}): RuntimeProfile {
  const input = profile.inputGuardrails.map(normalizeDescriptor).filter(Boolean);

  const output = profile.outputGuardrails.map(normalizeDescriptor).filter(Boolean);

  const tool = profile.toolGuardrails.map(normalizeDescriptor).filter(Boolean);

  return {
    id: profile.id,
    name: profile.name,
    input,
    output,
    tool,
    all: [...input, ...output, ...tool],
  };
}
