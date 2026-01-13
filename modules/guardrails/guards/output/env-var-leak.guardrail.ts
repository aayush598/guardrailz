import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';

/* ============================================================================
 * Config
 * ========================================================================= */
export interface EnvVarLeakGuardrailConfig {
  /**
   * If true, redact detected env vars instead of blocking
   */
  redact?: boolean;

  /**
   * Custom list of environment variable names to detect
   */
  sensitiveVars?: string[];
}

/* ============================================================================
 * Guardrail
 * ========================================================================= */
export class EnvVarLeakGuardrail extends BaseGuardrail<EnvVarLeakGuardrailConfig> {
  private readonly patterns: RegExp[];

  constructor(config?: unknown) {
    const resolved = (config ?? {}) as EnvVarLeakGuardrailConfig;
    super('EnvVarLeak', 'output', resolved);

    const defaultVars = [
      'AWS_SECRET_ACCESS_KEY',
      'AWS_ACCESS_KEY_ID',
      'DATABASE_URL',
      'OPENAI_API_KEY',
      'JWT_SECRET',
      'API_KEY',
      'TOKEN',
      'SECRET',
      'NODE_ENV',
    ];

    const vars = resolved.sensitiveVars ?? defaultVars;

    this.patterns = [
      // process.env.SECRET
      ...vars.map((v) => new RegExp(`process\\.env\\.${v}\\b`, 'i')),

      // $SECRET or ${SECRET}
      ...vars.map((v) => new RegExp(`\\$\\{?${v}\\}?`, 'i')),
    ];
  }

  execute(text: string) {
    if (!text || typeof text !== 'string') {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
      });
    }

    const matches = this.detect(text);

    if (matches.length === 0) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
      });
    }

    // Redaction mode
    if (this.config.redact) {
      const redacted = this.redact(text);

      return this.result({
        passed: true,
        action: 'MODIFY',
        severity: 'warning',
        message: 'Environment variables redacted from output',
        redactedText: redacted,
        metadata: {
          detected: matches,
        },
      });
    }

    // Default: BLOCK
    return this.result({
      passed: false,
      action: 'BLOCK',
      severity: 'error',
      message: 'Environment variable leakage detected in output',
      metadata: {
        detected: matches,
      },
    });
  }

  /* =========================================================================
   * Helpers
   * ========================================================================= */

  private detect(text: string): string[] {
    const found = new Set<string>();

    for (const rx of this.patterns) {
      const match = text.match(rx);
      if (match) {
        found.add(match[0]);
      }
    }

    return Array.from(found);
  }

  private redact(text: string): string {
    let output = text;

    for (const rx of this.patterns) {
      output = output.replace(rx, '[REDACTED_ENV_VAR]');
    }

    return output;
  }
}
