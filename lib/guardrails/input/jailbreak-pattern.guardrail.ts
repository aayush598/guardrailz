import { BaseGuardrail } from '../core/base';
import { GuardrailContext } from '../core/context';
import { GuardrailAction, GuardrailSeverity } from '../core/types';

/* -------------------------------------------------------------------------- */
/* Config                                                                      */
/* -------------------------------------------------------------------------- */

export interface JailbreakPatternConfig {
  /**
   * If true, do not block — only warn
   */
  warnOnly?: boolean;

  /**
   * Custom jailbreak regex patterns
   */
  customPatterns?: RegExp[];
}

/* -------------------------------------------------------------------------- */
/* Guardrail                                                                   */
/* -------------------------------------------------------------------------- */

export class JailbreakPatternGuardrail extends BaseGuardrail<JailbreakPatternConfig> {
  private readonly patterns: RegExp[];

  constructor(config: JailbreakPatternConfig = {}) {
    super('JailbreakPattern', 'input', config);

    this.patterns = [
      // DAN-style
      /\b(do\s+anything\s+now|dan\s+mode)\b/i,

      // Instruction override (FIXED)
      /\b(ignore|disregard|bypass)\s+(all\s+)?(previous\s+|earlier\s+)?(rules|instructions|policies)\b/i,

      // System prompt override
      /\b(system\s+prompt|developer\s+instructions)\b.*\b(ignore|reveal|override)\b/i,

      // Role reassignment
      /\b(you\s+are\s+now|act\s+as|pretend\s+to\s+be)\s+(an?\s+)?(assistant|model|ai)\b/i,

      // Safety removal
      /\b(no\s+rules|without\s+limitations|unfiltered|uncensored)\b/i,

      // Multi-persona jailbreak
      /\b(two\s+responses|dual\s+mode|split\s+personality)\b/i,
    ];

    if (config.customPatterns?.length) {
      this.patterns.push(...config.customPatterns);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Execution                                                                */
  /* ------------------------------------------------------------------------ */

  execute(text: string, _context: GuardrailContext) {
    if (!text || typeof text !== 'string') {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'Empty or invalid input',
      });
    }

    const normalized = text.toLowerCase();
    const matches: string[] = [];

    for (const pattern of this.patterns) {
      const match = normalized.match(pattern);
      if (match) {
        matches.push(match[0]);
      }
    }

    if (!matches.length) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'No jailbreak patterns detected',
      });
    }

    const action: GuardrailAction = this.config.warnOnly ? 'WARN' : 'BLOCK';

    const severity: GuardrailSeverity = action === 'BLOCK' ? 'error' : 'warning';

    return this.result({
      passed: action !== 'BLOCK',
      action,
      severity,
      message: 'Prompt jailbreak pattern detected',
      metadata: {
        matches: matches.slice(0, 5),
        totalMatches: matches.length,
      },
    });
  }
}
