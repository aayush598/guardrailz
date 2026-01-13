import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';
import { GuardrailAction } from '@/modules/guardrails/engine/types';

type ResolvedLanguageRestrictionConfig = {
  allowedScripts: Array<
    'latin' | 'cyrillic' | 'arabic' | 'devanagari' | 'han' | 'hiragana' | 'katakana' | 'hangul'
  >;
  minAllowedRatio: number;
  maxDisallowedChars: number;
  warnOnly: boolean;
};

/* ============================================================================
 * Config
 * ========================================================================== */
export interface LanguageRestrictionConfig {
  /**
   * Allowed Unicode script names (ISO 15924 style, simplified)
   * Examples: latin, cyrillic, arabic, devanagari
   */
  allowedScripts?: Array<
    'latin' | 'cyrillic' | 'arabic' | 'devanagari' | 'han' | 'hiragana' | 'katakana' | 'hangul'
  >;

  /**
   * Minimum percentage of characters that must belong
   * to allowed scripts (0–1)
   */
  minAllowedRatio?: number;

  /** NEW: absolute tolerance for short foreign snippets */
  maxDisallowedChars?: number;

  /**
   * Whether mixed scripts should WARN instead of BLOCK
   */
  warnOnly?: boolean;
}

/* ============================================================================
 * Unicode script regex map
 * ========================================================================== */
const SCRIPT_REGEX: Record<string, RegExp> = {
  latin: /\p{Script=Latin}/u,
  cyrillic: /\p{Script=Cyrillic}/u,
  arabic: /\p{Script=Arabic}/u,
  devanagari: /\p{Script=Devanagari}/u,
  han: /\p{Script=Han}/u,
  hiragana: /\p{Script=Hiragana}/u,
  katakana: /\p{Script=Katakana}/u,
  hangul: /\p{Script=Hangul}/u,
};

/* ============================================================================
 * Guardrail
 * ========================================================================== */
export class LanguageRestrictionGuardrail extends BaseGuardrail<ResolvedLanguageRestrictionConfig> {
  constructor(config: LanguageRestrictionConfig = {}) {
    super('LanguageRestriction', 'input', {
      allowedScripts: config.allowedScripts ?? ['latin'],
      minAllowedRatio: config.minAllowedRatio ?? 0.95,
      maxDisallowedChars: config.maxDisallowedChars ?? 2,
      warnOnly: config.warnOnly ?? false,
    });
  }

  execute(text: string) {
    if (!text || typeof text !== 'string') {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'Empty or invalid input',
      });
    }

    const chars = Array.from(text);
    let allowedCount = 0;
    let checkedCount = 0;

    for (const ch of chars) {
      // Ignore whitespace, digits, punctuation, emojis
      if (!/\p{L}/u.test(ch)) continue;

      checkedCount++;

      if (this.isAllowedScript(ch)) {
        allowedCount++;
      }
    }

    if (checkedCount === 0) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'No language-relevant characters detected',
      });
    }

    const disallowedCount = checkedCount - allowedCount;
    const ratio = allowedCount / checkedCount;

    if (
      ratio >= this.config.minAllowedRatio ||
      disallowedCount <= this.config.maxDisallowedChars!
    ) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'Input language is allowed',
        metadata: {
          allowedRatio: Number(ratio.toFixed(3)),
          disallowedChars: disallowedCount,
        },
      });
    }

    const action: GuardrailAction = this.config.warnOnly ? 'WARN' : 'BLOCK';

    return this.result({
      passed: action !== 'BLOCK',
      action,
      severity: 'warning',
      message: 'Input contains disallowed language or script',
      metadata: {
        allowedRatio: Number(ratio.toFixed(3)),
        allowedScripts: this.config.allowedScripts,
      },
    });
  }

  private isAllowedScript(ch: string): boolean {
    for (const script of this.config.allowedScripts!) {
      const rx = SCRIPT_REGEX[script];
      if (rx?.test(ch)) return true;
    }
    return false;
  }
}
