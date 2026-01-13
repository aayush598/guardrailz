import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';
import { GuardrailAction, GuardrailSeverity } from '@/modules/guardrails/engine/types';

export interface PHIAwarenessConfig {
  /**
   * What to do when PHI is detected
   * - warn: allow but flag
   * - block: reject input
   */
  mode?: 'warn' | 'block';

  /**
   * Whether to allow de-identified medical text
   */
  allowDeidentified?: boolean;
}

const MEDICAL_TERMS = [
  /\b(diagnosed with|diagnosis|treatment|prescribed|symptoms?)\b/i,
  /\b(diabetes|cancer|hiv|aids|asthma|depression|anxiety)\b/i,
  /\b(blood pressure|heart rate|cholesterol)\b/i,
];

const IDENTIFIERS = [
  /\b(name is|patient|mr\.|mrs\.)\b/i,
  /\b\d{3}-\d{2}-\d{4}\b/, // SSN
  /\b\d{10}\b/, // phone
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i, // email
  /\b\d{1,5}\s+\w+\s+(street|road|ave|avenue)\b/i,
];

export class PHIAwarenessGuardrail extends BaseGuardrail<PHIAwarenessConfig> {
  constructor(config: unknown = {}) {
    const resolved = (config ?? {}) as PHIAwarenessConfig;
    super('PHIAwareness', 'input', {
      mode: 'warn',
      allowDeidentified: true,
      ...resolved,
    });
  }

  execute(text: string) {
    if (!text || typeof text !== 'string') {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'Empty input',
      });
    }

    const hasMedical = MEDICAL_TERMS.some((rx) => rx.test(text));
    const hasIdentifier = IDENTIFIERS.some((rx) => rx.test(text));

    // Medical but no identifiers → allowed
    if (hasMedical && !hasIdentifier && this.config.allowDeidentified) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'Medical content without personal identifiers',
        metadata: { phi: false },
      });
    }

    // True PHI case
    if (hasMedical && hasIdentifier) {
      const action: GuardrailAction = this.config.mode === 'block' ? 'BLOCK' : 'WARN';

      const severity: GuardrailSeverity = action === 'BLOCK' ? 'error' : 'warning';

      return this.result({
        passed: action !== 'BLOCK',
        action,
        severity,
        message: 'Protected Health Information (PHI) detected',
        metadata: {
          phi: true,
          medicalDetected: hasMedical,
          identifierDetected: hasIdentifier,
        },
      });
    }

    // No PHI
    return this.result({
      passed: true,
      action: 'ALLOW',
      severity: 'info',
      message: 'No PHI detected',
      metadata: { phi: false },
    });
  }
}
