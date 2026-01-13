import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';

/* ============================================================================
 * Config
 * ========================================================================== */

export interface SecretLeakOutputConfig {
  blockOnDetection?: boolean;
  redactWith?: string;
  minEntropyLength?: number;
}

/* ============================================================================
 * Detection patterns
 * ========================================================================== */

type SecretPattern = {
  name: string;
  regex: RegExp;
};

const SECRET_PATTERNS: SecretPattern[] = [
  {
    name: 'OpenAI API Key',
    regex: /\bsk-[a-zA-Z0-9]{20,}\b/g,
  },
  {
    name: 'AWS Access Key',
    regex: /\bAKIA[0-9A-Z]{16}\b/g,
  },
  {
    name: 'GitHub Token',
    regex: /\bghp_[A-Za-z0-9]{36}\b/g,
  },
  {
    name: 'Stripe Secret Key',
    regex: /\bsk_live_[0-9a-zA-Z]{24,}\b/g,
  },
  {
    name: 'JWT',
    regex: /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g,
  },
  {
    name: 'Private Key Block',
    regex:
      /-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----[\s\S]+?-----END (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/g,
  },
  {
    name: 'Password Assignment',
    regex: /\b(password|passwd|pwd)\s*[:=]\s*["']?.{6,}["']?/gi,
  },
];

/* ============================================================================
 * Guardrail
 * ========================================================================== */

export class SecretLeakOutputGuardrail extends BaseGuardrail<SecretLeakOutputConfig> {
  constructor(config?: unknown) {
    const resolved = (config ?? {}) as SecretLeakOutputConfig;
    super('SecretLeakOutput', 'output', resolved);
  }

  execute(text: string) {
    if (!text || typeof text !== 'string') {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'Empty or non-text output',
      });
    }

    const detections: {
      type: string;
      match: string;
    }[] = [];

    let redacted = text;

    for (const pattern of SECRET_PATTERNS) {
      const matches = text.match(pattern.regex);
      if (!matches) continue;

      for (const match of matches) {
        detections.push({
          type: pattern.name,
          match,
        });

        redacted = redacted.replace(match, this.config.redactWith ?? '[REDACTED_SECRET]');
      }
    }

    if (detections.length === 0) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'No secrets detected in output',
      });
    }

    const shouldBlock = this.config.blockOnDetection === true;

    return this.result({
      passed: !shouldBlock,
      action: shouldBlock ? 'BLOCK' : 'MODIFY',
      severity: 'critical',
      message: 'Sensitive secrets detected in model output',
      redactedText: shouldBlock ? undefined : redacted,
      metadata: {
        detectedSecrets: detections.map((d) => d.type),
        count: detections.length,
      },
    });
  }
}
