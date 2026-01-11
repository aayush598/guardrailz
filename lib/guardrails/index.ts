import { guardrailRegistry } from './core/registry';

import { InputSizeGuardrail } from './input/input-size.guardrail';
import { SecretsInInputGuardrail } from './input/secrets.guardrail';
import { NSFWAdvancedGuardrail } from './input/nsfw.guardrail';
import { PHIAwarenessGuardrail } from './input/phi-awareness.guardrail';
import { UrlFileBlockerGuardrail } from './input/url-file-blocker.guardrail';
import { BinaryAttachmentGuardrail } from './input/binary-attachment.guardrail';
import { EncodingObfuscationGuardrail } from './input/encoding-obfuscation.guardrail';
import { DangerousPatternsGuardrail } from './input/dangerous-patterns.guardrail';
import { LanguageRestrictionGuardrail } from './input/language-restriction.guardrail';
import { PromptInjectionSignatureGuardrail } from './input/prompt-injection.guardrail';
import { SystemPromptLeakGuardrail } from './input/system-prompt-leak.guardrail';
import { CrossContextManipulationGuardrail } from './input/cross-context-manipulation.guardrail';
import { JailbreakPatternGuardrail } from './input/jailbreak-pattern.guardrail';
import { RoleplayInjectionGuardrail } from './input/roleplay-injection.guardrail';
import { OverrideInstructionGuardrail } from './input/override-instruction.guardrail';

import { OutputPIIRedactionGuardrail } from './output/pii-redaction.guardrail';
import { ToolAccessControlGuardrail } from './tool/tool-access.guardrail';

// Input
guardrailRegistry.register('InputSize', (c) => new InputSizeGuardrail(c));
guardrailRegistry.register('SecretsInInput', (c) => new SecretsInInputGuardrail(c));
guardrailRegistry.register('NSFWAdvanced', (c) => new NSFWAdvancedGuardrail(c));
guardrailRegistry.register('PHIAwareness', (c) => new PHIAwarenessGuardrail(c));
guardrailRegistry.register('UrlFileBlocker', (c) => new UrlFileBlockerGuardrail(c));
guardrailRegistry.register('BinaryAttachment', (c) => new BinaryAttachmentGuardrail(c));
guardrailRegistry.register('EncodingObfuscation', (c) => new EncodingObfuscationGuardrail(c));
guardrailRegistry.register('DangerousPatterns', (c) => new DangerousPatternsGuardrail(c));
guardrailRegistry.register('LanguageRestriction', (c) => new LanguageRestrictionGuardrail(c));
guardrailRegistry.register(
  'PromptInjectionSignature',
  (c) => new PromptInjectionSignatureGuardrail(c),
);
guardrailRegistry.register('SystemPromptLeak', (c) => new SystemPromptLeakGuardrail(c));
guardrailRegistry.register(
  'CrossContextManipulation',
  (c) => new CrossContextManipulationGuardrail(c),
);
guardrailRegistry.register('JailbreakPattern', (c) => new JailbreakPatternGuardrail(c));
guardrailRegistry.register('RoleplayInjection', (c) => new RoleplayInjectionGuardrail(c));
guardrailRegistry.register('OverrideInstruction', (c) => new OverrideInstructionGuardrail(c));

// Output
guardrailRegistry.register('OutputPIIRedaction', (c) => new OutputPIIRedactionGuardrail(c));
guardrailRegistry.register('ToolAccess', (c) => new ToolAccessControlGuardrail(c));
