import { GuardrailDescriptor } from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function normalizeDescriptor(raw: unknown): GuardrailDescriptor | null {
  if (!raw) return null;

  // Canonical format: { name, config }
  if (isRecord(raw) && typeof raw.name === 'string') {
    return {
      name: raw.name,
      config: isRecord(raw.config) ? raw.config : raw.config,
    };
  }

  // Legacy format: { class, config }
  if (isRecord(raw) && typeof raw.class === 'string') {
    return {
      name: raw.class.replace(/Guardrail$/, ''),
      config: isRecord(raw.config) ? raw.config : raw.config,
    };
  }

  // String shorthand
  if (typeof raw === 'string') {
    return {
      name: raw.replace(/Guardrail$/, ''),
    };
  }

  return null;
}
