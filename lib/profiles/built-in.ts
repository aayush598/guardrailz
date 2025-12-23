// Built-in Guardrail Profiles

export const BUILTIN_PROFILES = {
  default: {
    name: 'default',
    description: 'Basic security and safety guardrails',
    inputGuardrails: [
      { class: 'SecretsInInputGuardrail', config: { severity: 'critical' } },
      { class: 'InputSizeGuardrail', config: { maxChars: 50000 } },
      {
      class: 'NSFWAdvancedGuardrail',
      config: {
        severityThreshold: 2,              // block explicit, warn contextual
        enableContextAnalysis: true,
        allowMedicalEducational: true,
        enableObfuscationDetection: true,
        minConfidence: 0.7,
      },
    },
    ],
    outputGuardrails: [
      { class: 'OutputPIIRedactionGuardrail', config: {} },
    ],
    toolGuardrails: [],
  },
  
  enterprise_security: {
    name: 'enterprise_security',
    description: 'Enterprise-grade security with strict controls',
    inputGuardrails: [
      { class: 'SecretsInInputGuardrail', config: { severity: 'critical' } },
      { class: 'InputSizeGuardrail', config: { maxChars: 25000 } },
    ],
    outputGuardrails: [
      { class: 'OutputPIIRedactionGuardrail', config: {} },
    ],
    toolGuardrails: [],
  },
  
  child_safety: {
    name: 'child_safety',
    description: 'Maximum safety for children and educational contexts',
    inputGuardrails: [
      { class: 'SecretsInInputGuardrail', config: { severity: 'critical' } },
      { class: 'InputSizeGuardrail', config: { maxChars: 30000 } },
    ],
    outputGuardrails: [
      { class: 'OutputPIIRedactionGuardrail', config: {} },
    ],
    toolGuardrails: [],
  },
  
  healthcare: {
    name: 'healthcare',
    description: 'HIPAA-compliant guardrails for healthcare',
    inputGuardrails: [
      { class: 'SecretsInInputGuardrail', config: { severity: 'critical' } },
      { class: 'InputSizeGuardrail', config: { maxChars: 40000 } },
    ],
    outputGuardrails: [
      { class: 'OutputPIIRedactionGuardrail', config: {} },
    ],
    toolGuardrails: [],
  },
  
  financial: {
    name: 'financial',
    description: 'Financial services compliance guardrails',
    inputGuardrails: [
      { class: 'SecretsInInputGuardrail', config: { severity: 'critical' } },
      { class: 'InputSizeGuardrail', config: { maxChars: 35000 } },
    ],
    outputGuardrails: [
      { class: 'OutputPIIRedactionGuardrail', config: {} },
    ],
    toolGuardrails: [],
  },
  
  minimal: {
    name: 'minimal',
    description: 'Minimal guardrails for development/testing',
    inputGuardrails: [
      { class: 'InputSizeGuardrail', config: { maxChars: 100000 } },
    ],
    outputGuardrails: [],
    toolGuardrails: [],
  },
};