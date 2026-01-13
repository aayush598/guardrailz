import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';

import { GuardrailAction, GuardrailSeverity } from '@/modules/guardrails/engine/types';

/* ============================================================================
 * Config
 * ============================================================================
 */
export interface InternalDataLeakConfig {
  /**
   * Custom internal domains (e.g. company.com, corp.internal)
   */
  internalDomains?: string[];

  /**
   * Allow warning instead of blocking
   */
  warnOnly?: boolean;

  /**
   * Enable filesystem path detection
   */
  detectFilePaths?: boolean;
}

/* ============================================================================
 * Guardrail
 * ============================================================================
 */
export class InternalDataLeakGuardrail extends BaseGuardrail<InternalDataLeakConfig> {
  private readonly domainPatterns: RegExp[];
  private readonly filePathPatterns: RegExp[];
  private readonly ipPatterns: RegExp[];

  constructor(config?: unknown) {
    const resolved = (config ?? {}) as InternalDataLeakConfig;
    super('InternalDataLeak', 'output', resolved);

    const domains = resolved.internalDomains ?? ['internal', 'corp', 'local', 'intranet'];

    this.domainPatterns = domains.map((d) => new RegExp(`\\b[\\w.-]+\\.${d}\\b`, 'i'));

    this.ipPatterns = [
      /\b10\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/,
      /\b192\.168\.\d{1,3}\.\d{1,3}\b/,
      /\b172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}\b/,
    ];

    this.filePathPatterns = [
      /\/(etc|var|usr|opt|home)\/[^\s]+/i,
      /[A-Z]:\\[^\s]+/i,
      /\/src\/|\/internal\/|\/admin\//i,
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

    const matches: string[] = [];

    for (const rx of this.domainPatterns) {
      const m = text.match(rx);
      if (m) matches.push(m[0]);
    }

    for (const rx of this.ipPatterns) {
      const m = text.match(rx);
      if (m) matches.push(m[0]);
    }

    if (this.config.detectFilePaths !== false) {
      for (const rx of this.filePathPatterns) {
        const m = text.match(rx);
        if (m) matches.push(m[0]);
      }
    }

    if (!matches.length) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
      });
    }

    const action: GuardrailAction = this.config.warnOnly ? 'WARN' : 'BLOCK';

    const severity: GuardrailSeverity = action === 'BLOCK' ? 'error' : 'warning';

    return this.result({
      passed: action !== 'BLOCK',
      action,
      severity,
      message: 'Internal or proprietary data detected in output',
      metadata: {
        matches: matches.slice(0, 5),
        matchCount: matches.length,
      },
    });
  }
}
