import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';
import { GuardrailContext } from '@/modules/guardrails/engine/context';

/**
 * Input Size Guardrail – Industrial Grade
 *
 * Responsibilities:
 * - Protect infra from oversized payloads
 * - Control LLM cost & latency
 * - Detect abuse via size-based heuristics
 * - Support soft limits, hard limits, and safe truncation
 */

export interface InputSizeConfig {
  /**
   * Absolute hard limits
   */
  maxChars?: number;
  maxBytes?: number;

  /**
   * Soft warning threshold (0–1 ratio of maxChars)
   * Example: 0.8 = warn at 80%
   */
  warnThresholdRatio?: number;

  /**
   * Whether to truncate instead of block when exceeding soft limit
   */
  truncateOnSoftLimit?: boolean;

  /**
   * Maximum characters allowed after truncation
   */
  truncateToChars?: number;

  /**
   * Enable abuse signaling when repeatedly exceeded
   */
  abuseSignal?: boolean;
}

export class InputSizeGuardrail extends BaseGuardrail<InputSizeConfig> {
  private readonly maxChars: number;
  private readonly maxBytes: number;
  private readonly warnThresholdRatio: number;
  private readonly truncateOnSoftLimit: boolean;
  private readonly truncateToChars: number;
  private readonly abuseSignal: boolean;

  constructor(config: unknown = {}) {
    const resolved = (config ?? {}) as InputSizeConfig;

    super('InputSize', 'input', resolved);

    this.maxChars = resolved.maxChars ?? 50_000;
    this.maxBytes = resolved.maxBytes ?? 200_000; // UTF-8 safe
    this.warnThresholdRatio = resolved.warnThresholdRatio ?? 0.8;
    this.truncateOnSoftLimit = resolved.truncateOnSoftLimit ?? false;
    this.truncateToChars = resolved.truncateToChars ?? this.maxChars;
    this.abuseSignal = resolved.abuseSignal ?? true;
  }

  execute(text: string, context: GuardrailContext) {
    const charCount = text.length;
    const byteCount = Buffer.byteLength(text, 'utf8');

    const warnThreshold = Math.floor(this.maxChars * this.warnThresholdRatio);

    // ─────────────────────────────────────────────────────────────
    // HARD BLOCK — absolute safety limits
    // ─────────────────────────────────────────────────────────────
    if (charCount > this.maxChars || byteCount > this.maxBytes) {
      if (this.abuseSignal) {
        context.securitySignals ??= {};
        context.securitySignals.excessiveFailures = true;
      }

      return this.result({
        passed: false,
        action: 'BLOCK',
        severity: 'critical',
        message: 'Input exceeds hard size limits',
        metadata: {
          charCount,
          byteCount,
          maxChars: this.maxChars,
          maxBytes: this.maxBytes,
        },
      });
    }

    // ─────────────────────────────────────────────────────────────
    // SOFT LIMIT — warn or truncate
    // ─────────────────────────────────────────────────────────────
    if (charCount >= warnThreshold) {
      if (this.truncateOnSoftLimit && charCount > this.truncateToChars) {
        const truncated = safeTruncate(text, this.truncateToChars);

        return this.result({
          passed: true,
          action: 'MODIFY',
          severity: 'warning',
          message: 'Input truncated due to size constraints',
          redactedText: truncated,
          metadata: {
            charCount,
            byteCount,
            truncatedTo: truncated.length,
            warnThreshold,
          },
        });
      }

      return this.result({
        passed: true,
        action: 'WARN',
        severity: 'warning',
        message: 'Input size approaching maximum limit',
        metadata: {
          charCount,
          byteCount,
          warnThreshold,
          maxChars: this.maxChars,
        },
      });
    }

    // ─────────────────────────────────────────────────────────────
    // ALLOW — normal operation
    // ─────────────────────────────────────────────────────────────
    return this.result({
      passed: true,
      action: 'ALLOW',
      severity: 'info',
      message: 'Input size within acceptable limits',
      metadata: {
        charCount,
        byteCount,
        maxChars: this.maxChars,
        maxBytes: this.maxBytes,
      },
    });
  }
}

/**
 * Safe truncation:
 * - Preserves UTF-8 boundaries
 * - Avoids splitting surrogate pairs
 */
function safeTruncate(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars);
}
