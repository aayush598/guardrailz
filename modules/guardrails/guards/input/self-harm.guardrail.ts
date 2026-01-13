import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';

/* ============================================================================
 * Self-Harm Guardrail
 * ============================================================================
 * Detects suicide ideation, self-harm intent, and related content.
 * Designed for deterministic, explainable behavior.
 * ========================================================================== */

export interface SelfHarmGuardrailConfig {
  /**
   * If true, blocks even third-person or informational references
   */
  strictMode?: boolean;

  /**
   * Minimum confidence threshold (0–1)
   */
  minConfidence?: number;
}

type SignalSeverity = 'none' | 'passive' | 'active' | 'imminent';

interface DetectionSignal {
  severity: SignalSeverity;
  confidence: number;
  matched: string[];
}

export class SelfHarmGuardrail extends BaseGuardrail<SelfHarmGuardrailConfig> {
  constructor(config: unknown = {}) {
    const resolved = (config ?? {}) as SelfHarmGuardrailConfig;
    super('SelfHarm', 'input', resolved);
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

    const normalized = text.toLowerCase();
    const signal = this.detect(normalized);

    if (signal.severity === 'none') {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'No self-harm content detected',
      });
    }

    if (signal.severity === 'passive') {
      if (this.config.strictMode) {
        return this.block(signal, 'Self-harm references detected');
      }

      return this.result({
        passed: true,
        action: 'WARN',
        severity: 'warning',
        message: 'Self-harm related references detected',
        metadata: {
          severity: signal.severity,
          confidence: signal.confidence,
          matched: signal.matched.slice(0, 5),
        },
      });
    }

    // Active or imminent intent
    return this.block(
      signal,
      signal.severity === 'imminent'
        ? 'Imminent self-harm risk detected'
        : 'Self-harm ideation detected',
    );
  }

  /* =========================================================================
   * Detection logic
   * ========================================================================= */

  private detect(text: string): DetectionSignal {
    const matched: string[] = [];

    // Imminent risk (highest priority)
    const imminent = [
      /\bi am going to kill myself\b/,
      /\bi plan to kill myself\b/,
      /\bi am ending my life\b/,
      /\btonight\b.*\bkill myself\b/,
    ];

    if (this.matchAny(text, imminent, matched)) {
      return { severity: 'imminent', confidence: 0.95, matched };
    }

    // Active ideation (first person)
    const active = [
      /\bi want to die\b/,
      /\bi want to hurt myself\b/,
      /\bi feel like killing myself\b/,
      /\bi don'?t want to live\b/,
    ];

    if (this.matchAny(text, active, matched)) {
      return { severity: 'active', confidence: 0.85, matched };
    }

    // Passive / third-person references
    const passive = [
      /\bsuicide\b/,
      /\bself[-\s]?harm\b/,
      /\bkilled himself\b/,
      /\bcutting myself\b/,
    ];

    if (this.matchAny(text, passive, matched)) {
      return { severity: 'passive', confidence: 0.6, matched };
    }

    return { severity: 'none', confidence: 0, matched: [] };
  }

  private matchAny(text: string, patterns: RegExp[], matched: string[]): boolean {
    let hit = false;
    for (const r of patterns) {
      const m = text.match(r);
      if (m) {
        hit = true;
        matched.push(m[0]);
      }
    }
    return hit;
  }

  /* =========================================================================
   * Helpers
   * ========================================================================= */

  private block(signal: DetectionSignal, message: string) {
    return this.result({
      passed: false,
      action: 'BLOCK',
      severity: 'critical',
      message,
      metadata: {
        severity: signal.severity,
        confidence: signal.confidence,
        matched: signal.matched.slice(0, 5),
      },
    });
  }
}
