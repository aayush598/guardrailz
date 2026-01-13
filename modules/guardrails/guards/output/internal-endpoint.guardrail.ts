import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';

/* -------------------------------------------------------------------------- */
/* Config                                                                      */
/* -------------------------------------------------------------------------- */
export interface InternalEndpointGuardrailConfig {
  /**
   * If true, redact endpoints instead of blocking
   */
  redact?: boolean;

  /**
   * Custom additional patterns
   */
  additionalPatterns?: RegExp[];
}

/* -------------------------------------------------------------------------- */
/* Guardrail                                                                   */
/* -------------------------------------------------------------------------- */
export class InternalEndpointLeakGuardrail extends BaseGuardrail<InternalEndpointGuardrailConfig> {
  private readonly patterns: RegExp[];

  constructor(config?: unknown) {
    const resolved = (config ?? {}) as InternalEndpointGuardrailConfig;
    super('InternalEndpointLeak', 'output', resolved);

    this.patterns = [
      // localhost & loopback
      /\blocalhost\b/i,
      /\b127\.0\.0\.1\b/,
      /\b0\.0\.0\.0\b/,

      // private IPv4 ranges
      /\b10\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/,
      /\b192\.168\.\d{1,3}\.\d{1,3}\b/,
      /\b172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}\b/,

      // cloud metadata
      /\b169\.254\.169\.254\b/,

      // internal DNS / k8s
      /\b[a-z0-9-]+\.internal\b/i,
      /\b[a-z0-9-]+\.svc(\.cluster\.local)?\b/i,

      // common internal ports
      /:\b(2375|2376|3306|5432|6379|9200|27017)\b/,
    ];

    if (resolved.additionalPatterns?.length) {
      this.patterns.push(...resolved.additionalPatterns);
    }
  }

  execute(text: string) {
    if (!text || typeof text !== 'string') {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'Empty output',
      });
    }

    const matches = this.patterns.filter((rx) => rx.test(text));

    if (matches.length === 0) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
      });
    }

    // Redaction mode
    if (this.config.redact) {
      let redacted = text;
      for (const rx of matches) {
        redacted = redacted.replace(rx, '[REDACTED_INTERNAL_ENDPOINT]');
      }

      return this.result({
        passed: true,
        action: 'MODIFY',
        severity: 'warning',
        message: 'Internal endpoints redacted from output',
        redactedText: redacted,
        metadata: {
          matches: matches.map((r) => r.source),
        },
      });
    }

    // Block mode (default)
    return this.result({
      passed: false,
      action: 'BLOCK',
      severity: 'critical',
      message: 'Internal service endpoint detected in output',
      metadata: {
        matches: matches.map((r) => r.source),
      },
    });
  }
}
