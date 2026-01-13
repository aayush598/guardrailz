import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';
import { GuardrailContext } from '../../engine/context';

/* -------------------------------------------------------------------------- */
/* Config                                                                      */
/* -------------------------------------------------------------------------- */

export interface ConfidentialityGuardrailConfig {
  /** Redact instead of block */
  redact?: boolean;

  /** Custom confidential keywords */
  keywords?: string[];

  /** Allow internal data for specific profiles */
  allowedProfiles?: string[];
}

/* -------------------------------------------------------------------------- */
/* Guardrail                                                                   */
/* -------------------------------------------------------------------------- */

export class ConfidentialityGuardrail extends BaseGuardrail<ConfidentialityGuardrailConfig> {
  private keywords: string[];

  constructor(config?: unknown) {
    const resolved = (config ?? {}) as ConfidentialityGuardrailConfig;
    super('Confidentiality', 'output', resolved);

    this.keywords = [
      'internal use only',
      'confidential',
      'restricted',
      'do not share',
      'proprietary',
      ...(resolved.keywords ?? []),
    ];
  }

  execute(text: string, context: GuardrailContext = {}) {
    if (!text || typeof text !== 'string') {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'Empty output',
      });
    }

    // Profile-based allowlist
    if (context.profileId && this.config.allowedProfiles?.includes(context.profileId)) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'Profile allowed to view confidential data',
      });
    }

    const findings = this.detectConfidentialSignals(text);

    if (!findings.length) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
      });
    }

    if (this.config.redact) {
      const redacted = this.redact(text, findings);

      return this.result({
        passed: true,
        action: 'MODIFY',
        severity: 'warning',
        message: 'Confidential information redacted',
        redactedText: redacted,
        metadata: { findings },
      });
    }

    return this.result({
      passed: false,
      action: 'BLOCK',
      severity: 'error',
      message: 'Confidential or restricted data detected in output',
      metadata: { findings },
    });
  }

  /* ------------------------------------------------------------------------ */
  /* Detection logic                                                          */
  /* ------------------------------------------------------------------------ */

  private detectConfidentialSignals(text: string) {
    const findings: Array<{ type: string; match: string }> = [];

    // Keywords
    for (const kw of this.keywords) {
      const rx = new RegExp(`\\b${escapeRegExp(kw)}\\b`, 'i');
      if (rx.test(text)) {
        findings.push({ type: 'keyword', match: kw });
      }
    }

    // Environment variables
    if (/\b(process\.env|AWS_SECRET|API_KEY|SECRET_KEY)\b/i.test(text)) {
      findings.push({ type: 'env', match: 'environment variable' });
    }

    // Internal IPs
    if (/\b(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1]))/.test(text)) {
      findings.push({ type: 'internal_ip', match: 'private IP address' });
    }

    // Stack traces
    if (/at\s+\w+\s+\(.*:\d+:\d+\)/.test(text)) {
      findings.push({ type: 'stacktrace', match: 'stack trace' });
    }

    return findings;
  }

  private redact(text: string, findings: { type: string; match: string }[]) {
    let result = text;

    for (const f of findings) {
      result = result.replace(new RegExp(escapeRegExp(f.match), 'gi'), '[REDACTED]');
    }

    return result;
  }
}

/* -------------------------------------------------------------------------- */
/* Utils                                                                      */
/* -------------------------------------------------------------------------- */

function escapeRegExp(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
