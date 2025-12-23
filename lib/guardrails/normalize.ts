export interface GuardrailDescriptor {
  name: string;
  config?: Record<string, any>;
}

export function normalizeGuardrailDescriptor(
  raw: any
): GuardrailDescriptor | null {
  if (!raw) return null;

  // Already canonical
  if (typeof raw === 'object' && typeof raw.name === 'string') {
    return { name: raw.name, config: raw.config };
  }

  // Legacy DB format: { class: 'XGuardrail', config }
  if (raw.class && typeof raw.class === 'string') {
    return {
      name: raw.class.replace(/Guardrail$/, ''),
      config: raw.config,
    };
  }

  // Legacy string format
  if (typeof raw === 'string') {
    return {
      name: raw.replace(/Guardrail$/, ''),
    };
  }

  return null;
}
