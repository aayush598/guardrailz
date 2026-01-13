import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';
import { GuardrailContext } from '../../engine/context';

/* ============================================================================
 * Config
 * ========================================================================= */

export interface CostThresholdConfig {
  /** Hard block limit (USD) */
  maxCostUsd: number;

  /** Warning threshold (USD) */
  warnCostUsd?: number;

  /** Which metric to enforce */
  mode?: 'request' | 'daily' | 'monthly';

  /** Whether to include metadata */
  includeTelemetry?: boolean;
}

/* ============================================================================
 * Guardrail
 * ========================================================================= */

function normalizeCostThresholdConfig(input: unknown): CostThresholdConfig {
  if (!input || typeof input !== 'object') {
    throw new Error('CostThresholdGuardrail requires config');
  }

  const c = input as Partial<CostThresholdConfig>;

  if (typeof c.maxCostUsd !== 'number') {
    throw new Error('CostThresholdGuardrail requires maxCostUsd');
  }

  return {
    maxCostUsd: c.maxCostUsd,
    warnCostUsd: c.warnCostUsd ?? c.maxCostUsd * 0.8,
    mode: c.mode ?? 'request',
    includeTelemetry: c.includeTelemetry ?? true,
  };
}

export class CostThresholdGuardrail extends BaseGuardrail<CostThresholdConfig> {
  constructor(config?: unknown) {
    const resolved = normalizeCostThresholdConfig(config);

    if (resolved.maxCostUsd <= 0) {
      throw new Error('CostThresholdGuardrail requires maxCostUsd > 0');
    }

    super('CostThreshold', 'general', resolved);
  }

  execute(_: string, context: GuardrailContext) {
    const usage = context.usage;

    if (!usage) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'No usage data provided',
      });
    }

    const mode = this.config.mode ?? 'request';

    const cost =
      mode === 'daily'
        ? usage.dailyCostUsd
        : mode === 'monthly'
          ? usage.monthlyCostUsd
          : usage.estimatedCostUsd;

    if (typeof cost !== 'number') {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'Cost metric not available',
      });
    }

    const warnAt = this.config.warnCostUsd ?? this.config.maxCostUsd * 0.8;

    /* -------------------- BLOCK -------------------- */
    if (cost >= this.config.maxCostUsd) {
      return this.result({
        passed: false,
        action: 'BLOCK',
        severity: 'error',
        message: `Cost limit exceeded (${cost.toFixed(2)} USD)`,
        metadata: this.buildMetadata(cost, mode),
      });
    }

    /* -------------------- WARN -------------------- */
    if (cost >= warnAt) {
      return this.result({
        passed: true,
        action: 'WARN',
        severity: 'warning',
        message: `Cost nearing limit (${cost.toFixed(2)} USD)`,
        metadata: this.buildMetadata(cost, mode),
      });
    }

    /* -------------------- ALLOW -------------------- */
    return this.result({
      passed: true,
      action: 'ALLOW',
      severity: 'info',
      message: 'Cost within limits',
      metadata: this.buildMetadata(cost, mode),
    });
  }

  private buildMetadata(cost: number, mode: string) {
    if (this.config.includeTelemetry === false) return undefined;

    return {
      mode,
      costUsd: Number(cost.toFixed(4)),
      maxCostUsd: this.config.maxCostUsd,
      timestamp: new Date().toISOString(),
    };
  }
}
