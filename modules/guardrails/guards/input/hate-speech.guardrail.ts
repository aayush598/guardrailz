import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';

/* ============================================================================
 * Hate Speech Guardrail
 * ============================================================================
 * - Rule-based, explainable
 * - Targets protected classes
 * - Avoids false positives via context checks
 * ========================================================================== */

export interface HateSpeechGuardrailConfig {
  blockSeverity?: 'strict' | 'moderate';
  customSlurs?: string[];
  allowQuotedContext?: boolean;
}

const PROTECTED_CLASSES = [
  'race',
  'religion',
  'ethnicity',
  'nationality',
  'gender',
  'sexual orientation',
  'disability',
  'caste',
  'immigration status',
];

const BASE_SLURS = [
  // Minimal starter list — expandable
  'kike',
  'faggot',
  'retard',
  'nigger',
  'chink',
  'spic',
];

const VIOLENCE_PATTERNS = [/\b(kill|hang|burn|eliminate|eradicate|shoot)\b/i];

export class HateSpeechGuardrail extends BaseGuardrail<HateSpeechGuardrailConfig> {
  private slurs: Set<string>;

  constructor(config: unknown = {}) {
    const resolved = (config ?? {}) as HateSpeechGuardrailConfig;
    super('HateSpeech', 'input', resolved);
    this.slurs = new Set([...BASE_SLURS, ...(resolved.customSlurs ?? [])]);
  }

  execute(text: string) {
    if (!text || typeof text !== 'string') {
      return this.allow('Empty or invalid input');
    }

    const normalized = text.toLowerCase();

    // Optional allowance for quoted / reporting context
    if (this.config.allowQuotedContext !== false && this.isQuotedContext(text)) {
      return this.allow('Quoted or reporting context detected');
    }

    const slurHits = this.findSlurs(normalized);
    const violenceHits = this.matchAny(VIOLENCE_PATTERNS, normalized);

    // Hard block: slur + violence or abuse
    if (slurHits.length && violenceHits) {
      return this.block('Targeted hate speech with abusive or violent intent', slurHits, true);
    }

    // Moderate block: slurs alone
    if (slurHits.length) {
      if (this.config.blockSeverity === 'moderate') {
        return this.warn('Hate-related language detected', slurHits);
      }
      return this.block('Hate speech targeting protected classes', slurHits, false);
    }

    return this.allow('No hate speech detected');
  }

  /* =========================================================================
   * Helpers
   * ========================================================================= */

  private findSlurs(text: string): string[] {
    return [...this.slurs].filter((s) => text.includes(s));
  }

  private matchAny(patterns: RegExp[], text: string): boolean {
    return patterns.some((rx) => rx.test(text));
  }

  private isQuotedContext(text: string): boolean {
    return /"(.*?)"|‘(.*?)’|“(.*?)”/.test(text);
  }

  /* =========================================================================
   * Result Builders
   * ========================================================================= */

  private allow(message: string) {
    return this.result({
      passed: true,
      action: 'ALLOW',
      severity: 'info',
      message,
    });
  }

  private warn(message: string, terms: string[]) {
    return this.result({
      passed: true,
      action: 'WARN',
      severity: 'warning',
      message,
      metadata: {
        matchedTerms: terms,
        protectedClasses: PROTECTED_CLASSES,
      },
    });
  }

  private block(message: string, terms: string[], violent: boolean) {
    return this.result({
      passed: false,
      action: 'BLOCK',
      severity: violent ? 'critical' : 'error',
      message,
      metadata: {
        matchedTerms: terms,
        protectedClasses: PROTECTED_CLASSES,
        violent,
      },
    });
  }
}
