import './index';

import { guardrailRegistry } from './core/registry';
import { executeGuardrails } from './core/executor';
import { GuardrailContext } from './core/context';
import { normalizeGuardrailDescriptor } from './normalize';

export async function runGuardrails(
  rawDescriptors: any[],
  text: string,
  context: GuardrailContext
) {
  const descriptors = rawDescriptors
    .map(normalizeGuardrailDescriptor)
    .filter((d): d is { name: string; config?: any } => {
      if (!d) return false;
      if (!guardrailRegistry.has(d.name)) {
        throw new Error(`Guardrail "${d.name}" not registered`);
      }
      return true;
    });

  const instances = descriptors.map(d =>
    guardrailRegistry.create(d.name, d.config)
  );

  return executeGuardrails(instances, text, context);
}
