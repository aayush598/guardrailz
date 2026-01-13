import { RuntimeProfile } from '../domain/runtime-profile';
import { normalizeDescriptor } from '@/modules/guardrails/descriptors/normalize';
import { isNonNull } from '@/shared/types/guards';

export function compileProfile(profile: {
  id: string;
  name: string;
  inputGuardrails: unknown[];
  outputGuardrails: unknown[];
  toolGuardrails: unknown[];
}): RuntimeProfile {
  const input = profile.inputGuardrails.map(normalizeDescriptor).filter(isNonNull);

  const output = profile.outputGuardrails.map(normalizeDescriptor).filter(isNonNull);

  const tool = profile.toolGuardrails.map(normalizeDescriptor).filter(isNonNull);

  return {
    id: profile.id,
    name: profile.name,
    input,
    output,
    tool,
    all: [...input, ...output, ...tool],
  };
}
