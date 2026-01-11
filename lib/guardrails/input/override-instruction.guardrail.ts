import { BaseGuardrail } from '../core/base';
import { GuardrailContext } from '../core/context';
import { GuardrailAction, GuardrailSeverity } from '../core/types';

export interface OverrideInstructionConfig {
  /**
   * If true, override attempts result in WARN instead of BLOCK
   */
  warnOnly?: boolean;

  /**
   * Custom phrases to detect (case-insensitive)
   */
  customPatterns?: RegExp[];
}

export class OverrideInstructionGuardrail extends BaseGuardrail<OverrideInstructionConfig> {
  private readonly patterns: RegExp[];

  constructor(config: OverrideInstructionConfig = {}) {
    super('OverrideInstruction', 'input', config);

    this.patterns = [
      // Direct override attempts
      /\b(ignore|disregard|bypass|override)\b.*\b(instruction|rules|policy|policies)\b/i,
      /\b(ignore|disregard|bypass)\b.*\b(system|developer)\b/i,

      // Instruction hierarchy attacks
      /\b(system\s+prompt)\b/i,
      /\b(developer\s+message)\b/i,
      /\b(previous\s+instructions)\b/i,

      // Persona / jailbreak signals
      /\b(you\s+are\s+now|act\s+as)\b.*\b(unrestricted|dan|developer|system)\b/i,

      // Safety disabling
      /\b(no\s+rules|without\s+restrictions|remove\s+safety)\b/i,

      ...(config.customPatterns ?? []),
    ];
  }

  execute(text: string, _context: GuardrailContext = {}) {
    if (!text || typeof text !== 'string') {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'Empty or invalid input',
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

    const action: GuardrailAction = this.config.warnOnly === true ? 'WARN' : 'BLOCK';

    const severity: GuardrailSeverity = action === 'BLOCK' ? 'error' : 'warning';

    return this.result({
      passed: action !== 'BLOCK',
      action,
      severity,
      message: 'Attempt to override system or developer instructions detected',
      metadata: {
        matches: matches.map((m) => m.source),
        matchCount: matches.length,
      },
    });
  }
}
