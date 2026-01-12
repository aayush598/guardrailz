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
import { RightToErasureGuardrail } from './input/right-to-erasure.guardrail';
import { UserConsentValidationGuardrail } from './input/user-consent.guardrail';

import { OutputPIIRedactionGuardrail } from './output/pii-redaction.guardrail';
import { ToolAccessControlGuardrail } from './tool/tool-access.guardrail';
import { SecretLeakOutputGuardrail } from './output/secret-leak-output.guardrail';
import { InternalDataLeakGuardrail } from './output/internal-data-leak.guardrail';
import { HallucinationRiskGuardrail } from './output/hallucination-risk.guardrail';
import { ConfidentialityGuardrail } from './output/confidentiality.guardrail';
import { OutputSchemaValidationGuardrail } from './output/output-schema-validation.guardrail';
import { CitationRequiredGuardrail } from './output/citation-required.guardrail';
import { SandboxedOutputGuardrail } from './output/sandboxed-output.guardrail';
import { QualityThresholdGuardrail } from './output/quality-threshold.guardrail';
import { EnvVarLeakGuardrail } from './output/env-var-leak.guardrail';
import { InternalEndpointLeakGuardrail } from './output/internal-endpoint.guardrail';

import { TelemetryEnforcementGuardrail } from './operational/telemetry-enforcement.guardrail';
import { ModelVersionPinGuardrail } from './operational/model-version-pin.guardrail';
import { CostThresholdGuardrail } from './operational/cost-threshold.guardrail';

import { RetentionCheckGuardrail } from './general/retention-check.guardrail';

import { IAMPermissionGuardrail } from './tool/iam-permission.guardrail';

import { ApiKeyRotationTriggerGuardrail } from './security/api-key-rotation.guardrail';
import { SecretsInLogsGuardrail } from './output/secrets-in-logs.guardrail';
import { FileWriteRestrictionGuardrail } from './tool/file-write-restriction.guardrail';
import { ApiRateLimitGuardrail } from './tool/api-rate-limit.guardrail';
import { DestructiveToolCallGuardrail } from './tool/destructive-tool-call.guardrail';
import { CommandInjectionOutputGuardrail } from './output/command-injection.guardrail';
import { RateLimitGuardrail } from './operational/rate-limit.guardrail';
import { GDPRDataMinimizationGuardrail } from './input/gdpr-data-minimization.guardrail';
import { DefamationGuardrail } from './content/defamation.guardrail';
import { MedicalAdviceGuardrail } from './content/medical-advice.guardrail';
import { PoliticalPersuasionGuardrail } from './input/political-persuasion.guardrail';

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
guardrailRegistry.register('RightToErasure', (c) => new RightToErasureGuardrail(c));
guardrailRegistry.register('UserConsentValidation', (c) => new UserConsentValidationGuardrail(c));
guardrailRegistry.register('EnvVarLeak', (c) => new EnvVarLeakGuardrail(c));

// Output
guardrailRegistry.register('OutputPIIRedaction', (c) => new OutputPIIRedactionGuardrail(c));
guardrailRegistry.register('ToolAccess', (c) => new ToolAccessControlGuardrail(c));
guardrailRegistry.register('SecretLeakOutput', (c) => new SecretLeakOutputGuardrail(c));
guardrailRegistry.register('InternalDataLeak', (c) => new InternalDataLeakGuardrail(c));
guardrailRegistry.register('HallucinationRisk', (c) => new HallucinationRiskGuardrail(c));
guardrailRegistry.register('Confidentiality', (c) => new ConfidentialityGuardrail(c));
guardrailRegistry.register('OutputSchemaValidation', (c) => new OutputSchemaValidationGuardrail(c));
guardrailRegistry.register('CitationRequired', (c) => new CitationRequiredGuardrail(c));
guardrailRegistry.register('SandboxedOutput', (c) => new SandboxedOutputGuardrail(c));
guardrailRegistry.register('QualityThreshold', (c) => new QualityThresholdGuardrail(c));
guardrailRegistry.register('InternalEndpointLeak', (c) => new InternalEndpointLeakGuardrail(c));

// Operational
guardrailRegistry.register('TelemetryEnforcement', (c) => new TelemetryEnforcementGuardrail(c));
guardrailRegistry.register('ModelVersionPin', (c) => new ModelVersionPinGuardrail(c));
guardrailRegistry.register('CostThreshold', (c) => new CostThresholdGuardrail(c));

// General
guardrailRegistry.register('RetentionCheck', (c) => new RetentionCheckGuardrail(c));

// Tool
guardrailRegistry.register('IAMPermission', (c) => new IAMPermissionGuardrail(c));

guardrailRegistry.register('ApiKeyRotationTrigger', (c) => new ApiKeyRotationTriggerGuardrail(c));

guardrailRegistry.register('SecretsInLogs', (c) => new SecretsInLogsGuardrail(c));
guardrailRegistry.register('FileWriteRestriction', (c) => new FileWriteRestrictionGuardrail(c));
guardrailRegistry.register('ApiRateLimit', (c) => new ApiRateLimitGuardrail(c));
guardrailRegistry.register('DestructiveToolCall', (c) => new DestructiveToolCallGuardrail(c));
guardrailRegistry.register('CommandInjectionOutput', (c) => new CommandInjectionOutputGuardrail(c));
guardrailRegistry.register(
  'RateLimit',
  (c) =>
    new RateLimitGuardrail({
      limit: c?.limit ?? 100,
      windowMs: c?.windowMs ?? 60_000,
      warnThreshold: c?.warnThreshold ?? 10,
    }),
);
guardrailRegistry.register('GDPRDataMinimization', (c) => new GDPRDataMinimizationGuardrail(c));
guardrailRegistry.register('Defamation', (c) => new DefamationGuardrail(c));
guardrailRegistry.register('MedicalAdvice', (c) => new MedicalAdviceGuardrail(c));
guardrailRegistry.register('PoliticalPersuasion', (c) => new PoliticalPersuasionGuardrail(c));
