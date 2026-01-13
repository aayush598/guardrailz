import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';

/* -------------------------------------------------------------------------- */
/* Config                                                                      */
/* -------------------------------------------------------------------------- */

export interface CrossContextManipulationConfig {
  /**
   * Whether to block (BLOCK) or warn (WARN) on detection
   * Default: BLOCK
   */
  enforcementMode?: 'block' | 'warn';

  /**
   * Custom additional patterns
   */
  additionalPatterns?: RegExp[];
}

/* -------------------------------------------------------------------------- */
/* Guardrail                                                                   */
/* -------------------------------------------------------------------------- */

export class CrossContextManipulationGuardrail extends BaseGuardrail<CrossContextManipulationConfig> {
  private readonly patterns: RegExp[];

  constructor(config: unknown = {}) {
    const resolved = (config ?? {}) as CrossContextManipulationConfig;
    super('CrossContextManipulation', 'input', resolved);

    this.patterns = [
      // Prior conversation references
      /\b(previous|earlier|last)\s+(conversation|chat|message|prompt)\b/i,
      /\b(as\s+we\s+discussed|as\s+mentioned\s+before)\b/i,

      // Hidden/system prompt probing
      /\b(system|developer|hidden)\s+(prompt|instruction|message)\b/i,
      /\bwhat\s+is\s+your\s+(system|developer)\s+prompt\b/i,

      // Context persistence abuse
      /\bremember\s+what\s+i\s+said\b/i,
      /\buse\s+the\s+context\s+from\b/i,
      /\bfrom\s+earlier\s+sessions?\b/i,

      // Instruction override patterns
      /\bignore\s+(all\s+)?previous\s+instructions\b/i,
      /\boverride\s+(the\s+)?(rules|instructions|system)\b/i,
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
        message: 'Empty or invalid input',
      });
    }

    const matches = this.detect(text);

    if (!matches.length) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'No cross-context manipulation detected',
      });
    }

    const enforcementMode = this.config.enforcementMode ?? 'block';

    return this.result({
      passed: enforcementMode !== 'block',
      action: enforcementMode === 'block' ? 'BLOCK' : 'WARN',
      severity: 'error',
      message: 'Cross-context manipulation attempt detected',
      metadata: {
        matches,
        matchCount: matches.length,
      },
    });
  }

  /* ------------------------------------------------------------------------ */
  /* Detection Logic                                                          */
  /* ------------------------------------------------------------------------ */

  private detect(text: string): string[] {
    const found: string[] = [];

    for (const pattern of this.patterns) {
      const match = text.match(pattern);
      if (match) {
        found.push(match[0]);
      }
    }

    return found;
  }
}
