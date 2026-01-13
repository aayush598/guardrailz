import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';
import { GuardrailContext } from '../../engine/context';
import { GuardrailResult } from '@/modules/guardrails/engine/types';

/* ============================================================================
 * Rate Limiter Store (In-Memory)
 * Replace with Redis / KV in production
 * ========================================================================== */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

/* ============================================================================
 * Config
 * ========================================================================== */

export interface RateLimitGuardrailConfig {
  limit: number;
  windowMs: number;
  warnThreshold?: number;
}

/* ============================================================================
 * Defaults
 * ========================================================================== */

const DEFAULT_CONFIG: RateLimitGuardrailConfig = {
  limit: 100,
  windowMs: 60_000,
  warnThreshold: undefined,
};

/* ============================================================================
 * Guardrail
 * ========================================================================== */

export class RateLimitGuardrail extends BaseGuardrail<RateLimitGuardrailConfig> {
  constructor(rawConfig?: unknown) {
    const config = RateLimitGuardrail.normalizeConfig(rawConfig);
    super('RateLimit', 'general', config);
  }

  execute(_: string, context: GuardrailContext): GuardrailResult {
    const key = context.apiKeyId ?? context.userId ?? 'anonymous';
    const now = Date.now();

    const entry = store.get(key);

    // New window
    if (!entry || now >= entry.resetAt) {
      store.set(key, {
        count: 1,
        resetAt: now + this.config.windowMs,
      });
      return this.allow(1);
    }

    entry.count++;

    if (entry.count > this.config.limit) {
      return this.result({
        passed: false,
        action: 'BLOCK',
        severity: 'error',
        message: 'Rate limit exceeded',
        metadata: {
          limit: this.config.limit,
          windowMs: this.config.windowMs,
          retryAfterMs: entry.resetAt - now,
        },
      });
    }

    const remaining = this.config.limit - entry.count;

    if (typeof this.config.warnThreshold === 'number' && remaining <= this.config.warnThreshold) {
      return this.result({
        passed: true,
        action: 'WARN',
        severity: 'warning',
        message: 'Approaching rate limit',
        metadata: { remaining },
      });
    }

    return this.allow(entry.count);
  }

  private allow(count: number): GuardrailResult {
    return this.result({
      passed: true,
      action: 'ALLOW',
      severity: 'info',
      metadata: {
        used: count,
        remaining: Math.max(0, this.config.limit - count),
      },
    });
  }

  /* =========================================================================
   * Config normalization (CRITICAL)
   * ========================================================================= */

  private static normalizeConfig(raw: unknown): RateLimitGuardrailConfig {
    if (!raw || typeof raw !== 'object') {
      return DEFAULT_CONFIG;
    }

    const cfg = raw as Partial<RateLimitGuardrailConfig>;

    return {
      limit: typeof cfg.limit === 'number' && cfg.limit > 0 ? cfg.limit : DEFAULT_CONFIG.limit,

      windowMs:
        typeof cfg.windowMs === 'number' && cfg.windowMs > 0
          ? cfg.windowMs
          : DEFAULT_CONFIG.windowMs,

      warnThreshold:
        typeof cfg.warnThreshold === 'number' && cfg.warnThreshold >= 0
          ? cfg.warnThreshold
          : undefined,
    };
  }

  /* =========================================================================
   * Test utilities
   * ========================================================================= */

  static __clearStore() {
    store.clear();
  }
}
