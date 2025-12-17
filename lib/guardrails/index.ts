export { executeGuardrails } from './core/executor';
export { guardrailRegistry } from './core/registry';

import { guardrailRegistry } from './core/registry';
import { InputSizeGuardrail } from './input/input-size.guardrail';
import { SecretsInInputGuardrail } from './input/secrets.guardrail';
import { NSFWGuardrail } from './input/nsfw.guardrail';
import { OutputPIIRedactionGuardrail } from './output/pii-redaction.guardrail';
import { ToolAccessGuardrail } from './tool/tool-access.guardrail';

// guardrailRegistry.register('InputSize', c => new InputSizeGuardrail(c));
// guardrailRegistry.register('Secrets', c => new SecretsInInputGuardrail(c));
// guardrailRegistry.register('NSFW', c => new NSFWGuardrail(c));
// guardrailRegistry.register('PIIRedaction', c => new OutputPIIRedactionGuardrail(c));
// guardrailRegistry.register('ToolAccess', c => new ToolAccessGuardrail(c));

export function normalizeGuardrailName(name: string): string {
  if (name.endsWith('Guardrail')) {
    return name.replace('Guardrail', '');
  }
  return name;
}


guardrailRegistry.register(
  'InputSize',
  c => new InputSizeGuardrail(c)
);

guardrailRegistry.register(
  'SecretsInInput',
  c => new SecretsInInputGuardrail(c)
);

guardrailRegistry.register(
  'NSFW',
  c => new NSFWGuardrail(c)
);

guardrailRegistry.register(
  'OutputPIIRedaction',
  c => new OutputPIIRedactionGuardrail(c)
);

guardrailRegistry.register(
  'ToolAccess',
  c => new ToolAccessGuardrail(c)
);


import './input/input-size.guardrail';
import './input/secrets.guardrail';
import './input/nsfw.guardrail';
import './output/pii-redaction.guardrail';
import './tool/tool-access.guardrail';