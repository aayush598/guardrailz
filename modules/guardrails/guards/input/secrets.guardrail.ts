import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';

interface SecretPattern {
  name: string;
  regex: RegExp;
}

export interface SecretsInInputGuardrailConfig {
  /**
   * Optional allowlist of secret types (by name)
   * If provided, only these secrets will be checked
   */
  allowlist?: string[];

  /**
   * If true, WARN instead of BLOCK
   */
  warnOnly?: boolean;
}

export class SecretsInInputGuardrail extends BaseGuardrail {
  private readonly patterns: SecretPattern[] = [
    { name: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/g },
    { name: 'GitHub Token', regex: /ghp_[a-zA-Z0-9]{36}/g },
    { name: 'OpenAI API Key', regex: /sk-[a-zA-Z0-9]{48}/g },
    { name: 'Stripe API Key', regex: /sk_(test|live)_[a-zA-Z0-9]{24,99}/g },
    { name: 'Generic API Key', regex: /api[_-]?key\s*[:=]\s*[a-zA-Z0-9_\-]{16,}/gi },
    { name: 'Bearer Token', regex: /Bearer\s+[a-zA-Z0-9._\-]{20,}/gi },
    { name: 'Private Key Block', regex: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/g },
    { name: 'JWT Token', regex: /eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g },
  ];

  constructor(config?: unknown) {
    const resolved = (config ?? {}) as SecretsInInputGuardrailConfig;
    super('SecretsInInputGuardrail', 'input', resolved);
  }

  execute(text: string) {
    const findings: Array<{ type: string; masked: string }> = [];

    for (const pattern of this.patterns) {
      const matches = text.match(pattern.regex);
      if (!matches) continue;

      for (const match of matches) {
        findings.push({
          type: pattern.name,
          masked: this.mask(match),
        });
      }
    }

    if (findings.length > 0) {
      return this.result({
        passed: false,
        severity: 'critical',
        action: 'BLOCK',
        message: `Detected ${findings.length} secret(s) in input`,
        metadata: {
          count: findings.length,
          secrets: findings,
        },
      });
    }

    return this.result({
      passed: true,
      severity: 'info',
      action: 'ALLOW',
      message: 'No secrets detected in input',
      metadata: {
        count: 0,
      },
    });
  }

  private mask(secret: string): string {
    if (secret.length <= 8) return '***';
    return `${secret.slice(0, 4)}***${secret.slice(-4)}`;
  }
}
