import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';
import { GuardrailContext } from '../../engine/context';

/* ============================================================================
 * Secrets in Logs Guardrail
 * ============================================================================
 * Detects secrets and credentials before content is logged.
 * Can BLOCK or REDACT depending on configuration.
 * ========================================================================== */

export interface SecretsInLogsConfig {
  action?: 'BLOCK' | 'REDACT';
  minEntropyLength?: number;
  enableGenericEntropyDetection?: boolean;
}

export class SecretsInLogsGuardrail extends BaseGuardrail<SecretsInLogsConfig> {
  private readonly secretPatterns: Array<{ name: string; regex: RegExp }>;

  constructor(config?: unknown) {
    const resolved = (config ?? {}) as SecretsInLogsConfig;
    super('SecretsInLogs', 'output', resolved);

    this.secretPatterns = [
      {
        name: 'AWS Access Key',
        regex: /\bAKIA[0-9A-Z]{16}\b/g,
      },
      {
        name: 'AWS Secret Key',
        regex: /\baws(.{0,20})?(secret|access)?(.{0,20})?['"]?[A-Za-z0-9\/+=]{40}['"]?/gi,
      },
      {
        name: 'JWT',
        regex: /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g,
      },
      {
        name: 'Private Key',
        regex: /-----BEGIN (RSA|EC|DSA)? ?PRIVATE KEY-----/g,
      },
      {
        name: 'API Key',
        regex: /\b(api[_-]?key|token|secret)\s*[:=]\s*['"]?[a-zA-Z0-9\-_.]{8,}['"]?/gi,
      },
    ];
  }

  execute(text: string, context: GuardrailContext = {}) {
    if (!text || typeof text !== 'string') {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'Empty log content',
      });
    }

    // Optional: only apply when logging context is present
    if (context.validationType && context.validationType !== 'output') {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'Not an output/log validation',
      });
    }

    const findings = this.detectSecrets(text);

    if (!findings.length) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'No secrets detected in logs',
      });
    }

    const action = this.config.action ?? 'BLOCK';

    if (action === 'REDACT') {
      const redacted = this.redact(text);

      return this.result({
        passed: true,
        action: 'MODIFY',
        severity: 'warning',
        message: 'Secrets redacted from logs',
        redactedText: redacted,
        metadata: {
          findings,
        },
      });
    }

    return this.result({
      passed: false,
      action: 'BLOCK',
      severity: 'critical',
      message: 'Secrets detected in log output',
      metadata: {
        findings,
      },
    });
  }

  /* =========================================================================
   * Detection
   * ========================================================================= */

  private detectSecrets(text: string): string[] {
    const matches: string[] = [];

    for (const pattern of this.secretPatterns) {
      if (pattern.regex.test(text)) {
        matches.push(pattern.name);
      }
    }

    if (this.config.enableGenericEntropyDetection !== false) {
      if (this.hasHighEntropyToken(text)) {
        matches.push('High entropy token');
      }
    }

    return [...new Set(matches)];
  }

  private hasHighEntropyToken(text: string): boolean {
    const minLength = this.config.minEntropyLength ?? 32;
    const candidates = text.split(/\s+/);

    return candidates.some((token) => {
      if (token.length < minLength) return false;
      return /^[A-Za-z0-9+/=_-]+$/.test(token);
    });
  }

  /* =========================================================================
   * Redaction
   * ========================================================================= */

  private redact(text: string): string {
    let result = text;

    for (const pattern of this.secretPatterns) {
      result = result.replace(pattern.regex, '[REDACTED]');
    }

    result = result.replace(/\b[A-Za-z0-9+/=_-]{32,}\b/g, '[REDACTED]');

    return result;
  }
}
