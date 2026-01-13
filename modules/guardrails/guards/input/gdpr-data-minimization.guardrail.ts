import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';

import { GuardrailAction, GuardrailSeverity } from '@/modules/guardrails/engine/types';

/* ============================================================================
 * GDPR Data Minimization Guardrail
 * ============================================================================
 */

export interface GDPRDataMinimizationConfig {
  /**
   * Allowed personal data fields (case-insensitive).
   * Anything outside this set is considered excessive.
   */
  allowedFields?: string[];

  /**
   * Maximum number of personal data items allowed in free text.
   */
  maxPersonalDataItems?: number;

  /**
   * If true, excessive data results in WARN instead of BLOCK.
   */
  warnOnly?: boolean;

  /**
   * Enable simple regex-based PII detection.
   */
  enablePIIDetection?: boolean;
}

const DEFAULT_ALLOWED_FIELDS = ['email', 'name', 'first_name', 'last_name'];

const PII_PATTERNS: Record<string, RegExp> = {
  email: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  phone: /\b\d{10,15}\b/,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/,
  credit_card: /\b\d{13,19}\b/,
};

export class GDPRDataMinimizationGuardrail extends BaseGuardrail<GDPRDataMinimizationConfig> {
  constructor(config: unknown = {}) {
    const resolved = (config ?? {}) as GDPRDataMinimizationConfig;
    super('GDPRDataMinimization', 'input', resolved);
  }

  execute(text: string) {
    if (!text || typeof text !== 'string') {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'No input provided',
      });
    }

    const allowedFields = new Set(
      (this.config.allowedFields ?? DEFAULT_ALLOWED_FIELDS).map((f) => f.toLowerCase()),
    );

    const findings = this.detectPersonalData(text);

    const excessive = findings.filter((f) => !allowedFields.has(f.type));

    const maxAllowed = this.config.maxPersonalDataItems ?? 2;
    const excessiveCount = excessive.length;

    if (excessiveCount === 0 && findings.length <= maxAllowed) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'Input complies with data minimization',
        metadata: {
          detected: findings,
        },
      });
    }

    const action: GuardrailAction = this.config.warnOnly === true ? 'WARN' : 'BLOCK';

    const severity: GuardrailSeverity = action === 'BLOCK' ? 'error' : 'warning';

    return this.result({
      passed: action !== 'BLOCK',
      action,
      severity,
      message: 'Excessive personal data detected (GDPR data minimization)',
      metadata: {
        detected: findings,
        excessive,
        allowedFields: Array.from(allowedFields),
      },
    });
  }

  /* =========================================================================
   * Detection Logic
   * ========================================================================= */

  private detectPersonalData(text: string): Array<{
    type: string;
    value: string;
  }> {
    if (this.config.enablePIIDetection === false) return [];

    const findings: Array<{ type: string; value: string }> = [];

    for (const [type, regex] of Object.entries(PII_PATTERNS)) {
      const matches = text.match(regex);
      if (matches) {
        findings.push({
          type,
          value: matches[0],
        });
      }
    }

    return findings;
  }
}
