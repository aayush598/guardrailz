import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';

import { GuardrailAction, GuardrailSeverity } from '@/modules/guardrails/engine/types';

/* ============================================================================
 * Config
 * ========================================================================== */
export interface QualityThresholdConfig {
  /** Minimum character length */
  minLength?: number;

  /** Maximum allowed repetition ratio (0–1) */
  maxRepetitionRatio?: number;

  /** Minimum unique word ratio (0–1) */
  minUniqueWordRatio?: number;

  /** If true, BLOCK instead of WARN */
  hardFail?: boolean;
}

/* ============================================================================
 * Guardrail
 * ========================================================================== */
export class QualityThresholdGuardrail extends BaseGuardrail<QualityThresholdConfig> {
  constructor(config?: unknown) {
    const resolved = (config ?? {}) as QualityThresholdConfig;
    super('QualityThreshold', 'output', resolved);
  }

  execute(text: string) {
    if (!text || typeof text !== 'string') {
      return this.result({
        passed: false,
        action: 'BLOCK',
        severity: 'error',
        message: 'Invalid or empty output',
      });
    }

    const metrics = this.computeMetrics(text);
    const violations = this.evaluate(metrics);

    if (!violations.length) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'Output meets quality thresholds',
        metadata: metrics,
      });
    }

    const action: GuardrailAction = this.config.hardFail ? 'BLOCK' : 'WARN';

    const severity: GuardrailSeverity = action === 'BLOCK' ? 'error' : 'warning';

    return this.result({
      passed: action !== 'BLOCK',
      action,
      severity,
      message: `Quality issues detected: ${violations.join(', ')}`,
      metadata: {
        ...metrics,
        violations,
      },
    });
  }

  /* =========================================================================
   * Quality Metrics
   * ========================================================================= */

  private computeMetrics(text: string) {
    const trimmed = text.trim();
    const words = trimmed.split(/\s+/).filter(Boolean);

    const totalWords = words.length;
    const uniqueWords = new Set(words.map((w) => w.toLowerCase())).size;

    const wordCounts: Record<string, number> = {};
    for (const w of words) {
      const key = w.toLowerCase();
      wordCounts[key] = (wordCounts[key] ?? 0) + 1;
    }

    const mostRepeated = Math.max(...Object.values(wordCounts));
    const repetitionRatio = totalWords === 0 ? 0 : mostRepeated / totalWords;

    return {
      length: trimmed.length,
      totalWords,
      uniqueWords,
      uniqueWordRatio: totalWords === 0 ? 0 : uniqueWords / totalWords,
      repetitionRatio,
    };
  }

  /* =========================================================================
   * Evaluation Logic
   * ========================================================================= */

  private evaluate(metrics: ReturnType<QualityThresholdGuardrail['computeMetrics']>) {
    const violations: string[] = [];

    const minLength = this.config.minLength ?? 30;
    const maxRepetitionRatio = this.config.maxRepetitionRatio ?? 0.4;
    const minUniqueWordRatio = this.config.minUniqueWordRatio ?? 0.4;

    if (metrics.length < minLength) {
      violations.push('too_short');
    }

    if (metrics.repetitionRatio > maxRepetitionRatio) {
      violations.push('high_repetition');
    }

    if (metrics.uniqueWordRatio < minUniqueWordRatio) {
      violations.push('low_diversity');
    }

    return violations;
  }
}
