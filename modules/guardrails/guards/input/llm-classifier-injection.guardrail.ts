import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';
import {
  GuardrailAction,
  GuardrailSeverity,
  GuardrailResult,
} from '@/modules/guardrails/engine/types';

/* ============================================================================
 * Config
 * ========================================================================== */
export interface LLMClassifierInjectionConfig {
  blockThreshold?: number;
  warnThreshold?: number;
  enableExplainability?: boolean;
}

/* ============================================================================
 * Internal signal model
 * ========================================================================== */
interface InjectionSignal {
  type: string;
  weight: number;
  matched: string;
  highRisk?: boolean;
}

/* ============================================================================
 * Guardrail
 * ========================================================================== */
export class LLMClassifierInjectionGuardrail extends BaseGuardrail<LLMClassifierInjectionConfig> {
  constructor(config: LLMClassifierInjectionConfig = {}) {
    super('LLMClassifierInjection', 'input', {
      blockThreshold: config.blockThreshold ?? 0.8,
      warnThreshold: config.warnThreshold ?? 0.25,
      enableExplainability: config.enableExplainability ?? true,
    });
  }

  execute(text: string): GuardrailResult {
    if (!text || typeof text !== 'string') {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'Empty or invalid input',
      });
    }

    const normalized = text.toLowerCase();
    const signals = this.extractSignals(normalized);

    // 🔒 Hard BLOCK: override instructions + system prompt reference
    const hasOverride = signals.some((s) => s.type === 'override_instruction');
    const hasSystemRef = signals.some((s) => s.type === 'system_prompt_reference');

    if (hasOverride && hasSystemRef) {
      return this.buildResult(
        'BLOCK',
        1.0,
        signals,
        'Explicit system instruction override detected',
      );
    }

    const score = this.computeScore(signals);

    if (score >= this.config.blockThreshold) {
      return this.buildResult('BLOCK', score, signals, 'High confidence prompt injection detected');
    }

    if (score >= this.config.warnThreshold) {
      return this.buildResult('WARN', score, signals, 'Possible prompt injection detected');
    }

    return this.buildResult('ALLOW', score, signals, 'No prompt injection detected');
  }

  /* =========================================================================
   * Signal Extraction
   * ========================================================================= */

  private extractSignals(content: string): InjectionSignal[] {
    const signals: InjectionSignal[] = [];

    const patterns: Array<[string, RegExp, number, boolean?]> = [
      [
        'override_instruction',
        /\b(ignore|disregard|bypass)\b.*\b(instruction|instructions|policy|policies|rules)\b/,
        0.6,
        true,
      ],
      [
        'system_prompt_reference',
        /\b(system prompt|developer message|hidden instruction)\b/,
        0.7,
        true,
      ],
      ['role_change', /\b(you are now|act as|pretend to be)\b/, 0.35],
      ['jailbreak_keyword', /\b(dan|do anything now|unfiltered)\b/, 0.6, true],
      ['instruction_hierarchy', /\b(highest priority|override all)\b/, 0.5],
      ['meta_prompting', /\b(previous message|above instructions|this prompt)\b/, 0.3],
    ];

    for (const [type, regex, weight, highRisk] of patterns) {
      const match = content.match(regex);
      if (match) {
        signals.push({
          type,
          weight,
          matched: match[0],
          highRisk,
        });
      }
    }

    return signals;
  }

  /* =========================================================================
   * Scoring
   * ========================================================================= */

  private computeScore(signals: InjectionSignal[]): number {
    if (!signals.length) return 0;

    let score = 0;
    for (const s of signals) {
      score += s.weight * (1 - score);
    }

    return Number(Math.min(1, score).toFixed(3));
  }

  /* =========================================================================
   * Result builder
   * ========================================================================= */

  private buildResult(
    action: GuardrailAction,
    score: number,
    signals: InjectionSignal[],
    message: string,
  ): GuardrailResult {
    const severityMap: Record<GuardrailAction, GuardrailSeverity> = {
      ALLOW: 'info',
      WARN: 'warning',
      BLOCK: 'error',
      MODIFY: 'warning',
    };

    return this.result({
      passed: action !== 'BLOCK',
      action,
      severity: severityMap[action],
      message,
      metadata: this.config.enableExplainability
        ? {
            score,
            signalsDetected: signals.length,
            signals,
            model: 'heuristic-ensemble-v3',
          }
        : undefined,
    });
  }
}
