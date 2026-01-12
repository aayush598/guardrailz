import { BaseGuardrail } from '../core/base';
import { GuardrailContext } from '../core/context';
import { GuardrailAction, GuardrailSeverity } from '../core/types';

/* ============================================================================
 * Violence Severity Levels
 * ========================================================================== */
enum ViolenceSeverity {
  NONE = 0,
  NON_GRAPHIC = 1,
  GRAPHIC = 2,
  EXTREME = 3,
}

/* ============================================================================
 * Guardrail Config
 * ========================================================================== */
export interface ViolenceGuardrailConfig {
  /**
   * If true, non-graphic violence only WARNs instead of ALLOW
   * Default: true
   */
  warnOnNonGraphic?: boolean;

  /**
   * If true, threats directed at a person escalate severity
   * Default: true
   */
  escalateThreats?: boolean;
}

/* ============================================================================
 * Violence Guardrail
 * ========================================================================== */
export class ViolenceGuardrail extends BaseGuardrail<ViolenceGuardrailConfig> {
  constructor(config: ViolenceGuardrailConfig = {}) {
    super('Violence', 'input', config);
  }

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

    const severity = this.detectSeverity(normalized);

    if (severity === ViolenceSeverity.NONE) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'No violent content detected',
      });
    }

    if (severity === ViolenceSeverity.NON_GRAPHIC) {
      if (this.config.warnOnNonGraphic !== false) {
        return this.result({
          passed: true,
          action: 'WARN',
          severity: 'warning',
          message: 'Non-graphic violent content detected',
          metadata: { severity: 'non-graphic' },
        });
      }

      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'Non-graphic violence allowed',
      });
    }

    // GRAPHIC or EXTREME → BLOCK
    return this.result({
      passed: false,
      action: 'BLOCK',
      severity: severity === ViolenceSeverity.EXTREME ? 'critical' : 'error',
      message: 'Graphic or extreme violent content detected',
      metadata: {
        severity: severity === ViolenceSeverity.EXTREME ? 'extreme' : 'graphic',
      },
    });
  }

  /* =========================================================================
   * Detection Logic
   * ========================================================================= */

  private detectSeverity(content: string): ViolenceSeverity {
    // Extreme violence
    if (EXTREME_VIOLENCE_PATTERNS.some((r) => r.test(content))) {
      return ViolenceSeverity.EXTREME;
    }

    // Graphic violence
    if (GRAPHIC_VIOLENCE_PATTERNS.some((r) => r.test(content))) {
      return ViolenceSeverity.GRAPHIC;
    }

    // Non-graphic violence
    if (NON_GRAPHIC_VIOLENCE_PATTERNS.some((r) => r.test(content))) {
      return ViolenceSeverity.NON_GRAPHIC;
    }

    return ViolenceSeverity.NONE;
  }
}

/* ============================================================================
 * Pattern Sets
 * ========================================================================== */

const EXTREME_VIOLENCE_PATTERNS: RegExp[] = [
  /\b(dismember(ed|ment)?|decapitat(e|ed|ion))\b/i,
  /\b(gore|gory|entrails|organs\s+spilling)\b/i,
  /\b(burn(ed|ing)?\s+alive)\b/i,
];

const GRAPHIC_VIOLENCE_PATTERNS: RegExp[] = [
  /\b(blood\s+splatter(ed)?|bleeding\s+out)\b/i,
  /\b(stab(bed|bing)?|shot\s+dead)\b/i,
  /\b(torture(d)?|brutally\s+beat(en)?)\b/i,
];

const NON_GRAPHIC_VIOLENCE_PATTERNS: RegExp[] = [
  /\b(kill(ed|ing)?|murder(ed)?)\b/i,
  /\b(fight(ing)?|assault(ed)?)\b/i,
  /\b(war|battle|combat)\b/i,
  /\b(threat(en|ening)?)\b/i,
];
