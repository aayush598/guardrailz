import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';

export interface PoliticalPersuasionConfig {
  /**
   * If true, blocks all political persuasion (even non-targeted).
   * Default: false (only targeted persuasion is blocked)
   */
  strictMode?: boolean;

  /**
   * Whether election interference patterns should BLOCK instead of WARN
   * Default: true
   */
  blockElectionInterference?: boolean;
}

export class PoliticalPersuasionGuardrail extends BaseGuardrail<PoliticalPersuasionConfig> {
  constructor(config: unknown = {}) {
    const resolved = (config ?? {}) as PoliticalPersuasionConfig;
    super('PoliticalPersuasion', 'input', resolved);
  }

  execute(text: string) {
    if (!text || typeof text !== 'string') {
      return this.allow('Empty or invalid input');
    }

    const normalized = text.toLowerCase();

    // 1. Election interference (highest severity)
    if (this.containsElectionInterference(normalized)) {
      return this.result({
        passed: false,
        action: this.config.blockElectionInterference === false ? 'WARN' : 'BLOCK',
        severity: 'critical',
        message: 'Election interference or voter manipulation detected',
      });
    }

    // 2. Targeted political persuasion (BLOCK)
    if (this.containsTargetedPersuasion(normalized)) {
      return this.result({
        passed: false,
        action: 'BLOCK',
        severity: 'error',
        message: 'Targeted political persuasion is not allowed',
      });
    }

    // 3. Generic political persuasion
    if (this.containsGenericPersuasion(normalized)) {
      if (this.config.strictMode) {
        return this.result({
          passed: false,
          action: 'BLOCK',
          severity: 'warning',
          message: 'Political persuasion is restricted in strict mode',
        });
      }

      return this.result({
        passed: true,
        action: 'WARN',
        severity: 'warning',
        message: 'General political persuasion detected',
      });
    }

    // 4. Allowed political content (informational)
    return this.allow('No political persuasion detected');
  }

  /* =========================
   * Detection helpers
   * ========================= */

  private containsTargetedPersuasion(text: string): boolean {
    const audienceTargets = [
      'voters in',
      'people like you',
      'as a',
      'you should vote',
      'convince',
      'persuade',
      'appeal to',
    ];

    const demographicTargets = [
      'black voters',
      'white voters',
      'young voters',
      'elderly voters',
      'women voters',
      'men voters',
      'students',
      'immigrants',
      'christians',
      'muslims',
    ];

    const politicalActions = ['vote for', 'vote against', 'support', 'oppose', 'elect', 'reject'];

    return (
      (this.matchAny(text, demographicTargets) && this.matchAny(text, politicalActions)) ||
      (this.matchAny(text, audienceTargets) && this.matchAny(text, politicalActions))
    );
  }

  private containsGenericPersuasion(text: string): boolean {
    return this.matchAny(text, [
      'vote for',
      'vote against',
      'support this party',
      'support this candidate',
      'oppose the government',
      'elect the best leader',
    ]);
  }

  private containsElectionInterference(text: string): boolean {
    return this.matchAny(text, [
      'how to rig an election',
      'fake ballots',
      'suppress votes',
      'stop people from voting',
      'interfere with election',
      'tamper with voting machines',
    ]);
  }

  private matchAny(text: string, patterns: string[]): boolean {
    return patterns.some((p) => text.includes(p));
  }

  private allow(message: string) {
    return this.result({
      passed: true,
      action: 'ALLOW',
      severity: 'info',
      message,
    });
  }
}
