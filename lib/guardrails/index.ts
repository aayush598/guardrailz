import { guardrailRegistry } from './core/registry';

import { InputSizeGuardrail } from './input/input-size.guardrail';
import { SecretsInInputGuardrail } from './input/secrets.guardrail';
import { NSFWAdvancedGuardrail } from './input/nsfw.guardrail';
import { PHIAwarenessGuardrail } from './input/phi-awareness.guardrail';

import { OutputPIIRedactionGuardrail } from './output/pii-redaction.guardrail';
import { ToolAccessControlGuardrail } from './tool/tool-access.guardrail';

// Input
guardrailRegistry.register('InputSize', c => new InputSizeGuardrail(c));
guardrailRegistry.register('SecretsInInput', c => new SecretsInInputGuardrail(c));
guardrailRegistry.register('NSFWAdvanced', c => new NSFWAdvancedGuardrail(c));
guardrailRegistry.register('PHIAwareness', c => new PHIAwarenessGuardrail(c));

// Output
guardrailRegistry.register('OutputPIIRedaction', c => new OutputPIIRedactionGuardrail(c));
guardrailRegistry.register('ToolAccess', c => new ToolAccessControlGuardrail(c));

