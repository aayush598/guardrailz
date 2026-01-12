import { BaseGuardrail } from '../core/base';
import { GuardrailContext } from '../core/context';
import { GuardrailAction, GuardrailSeverity } from '../core/types';

/* -------------------------------------------------------------------------- */
/* Config                                                                      */
/* -------------------------------------------------------------------------- */

export interface DefamationGuardrailConfig {
  /**
   * If true, allows statements with uncertainty qualifiers
   * like "allegedly", "reportedly", etc.
   */
  allowAllegations?: boolean;

  /**
   * Custom list of crime / wrongdoing keywords
   */
  wrongdoingTerms?: string[];
}

/* -------------------------------------------------------------------------- */
/* Guardrail                                                                   */
/* -------------------------------------------------------------------------- */

export class DefamationGuardrail extends BaseGuardrail<DefamationGuardrailConfig> {
  private wrongdoingPatterns: RegExp[];
  private allegationQualifiers: RegExp[];

  constructor(config: DefamationGuardrailConfig = {}) {
    super('Defamation', 'input', config);

    const terms = config.wrongdoingTerms ?? [
      'fraud',
      'scam',
      'criminal',
      'thief',
      'corrupt',
      'embezzlement',
      'money laundering',
      'sexual assault',
      'rape',
      'abuse',
      'bribery',
      'terrorist',
    ];

    this.wrongdoingPatterns = terms.map((t) => new RegExp(`\\b${escapeRegExp(t)}\\b`, 'i'));

    this.allegationQualifiers = [
      /\ballegedly\b/i,
      /\breportedly\b/i,
      /\baccording to\b/i,
      /\bclaimed that\b/i,
      /\bcharges? (were )?filed\b/i,
    ];
  }

  execute(text: string, _context: GuardrailContext) {
    if (!text || typeof text !== 'string') {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
      });
    }

    const normalized = text.toLowerCase();

    const hasWrongdoing = this.wrongdoingPatterns.some((rx) => rx.test(normalized));

    if (!hasWrongdoing) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
      });
    }

    const hasQualifier = this.allegationQualifiers.some((rx) => rx.test(normalized));

    if (hasQualifier && this.config.allowAllegations !== false) {
      return this.result({
        passed: true,
        action: 'WARN',
        severity: 'warning',
        message: 'Potentially defamatory allegation detected',
      });
    }

    return this.result({
      passed: false,
      action: 'BLOCK',
      severity: 'critical',
      message: 'Defamatory claim detected: unverified allegation of wrongdoing',
      metadata: {
        category: 'defamation',
      },
    });
  }
}

/* -------------------------------------------------------------------------- */
/* Utils                                                                       */
/* -------------------------------------------------------------------------- */

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
