/* ============================================================================
 * Advanced NSFW Content Guardrail (Production-Grade)
 * ============================================================================
 * Multi-layer, multi-signal NSFW detection with:
 *  - Severity levels (0–3)
 *  - Context awareness (medical / educational / intent)
 *  - Obfuscation detection
 *  - Ensemble decision logic
 *  - Telemetry & explainability
 *
 * Ported from Python → TypeScript with architectural parity.
 * ========================================================================== */

import { BaseGuardrail } from '../core/base';
import { GuardrailContext } from '../core/context';
import {
  GuardrailAction,
  GuardrailSeverity,
} from '../core/types';

/* ---------------------------------------------------------------------------
 * Severity Levels
 * ------------------------------------------------------------------------- */
export enum NSFWSeverityLevel {
  LEVEL_0_ALLOWED = 0,
  LEVEL_1_RESTRICTED = 1,
  LEVEL_2_CONTEXTUAL = 2,
  LEVEL_3_CRITICAL = 3,
}

/* ---------------------------------------------------------------------------
 * Detection Signal
 * ------------------------------------------------------------------------- */
interface NSFWDetectionSignal {
  signalType: string;
  confidence: number; // 0.0 – 1.0
  matchedTerms: string[];
  severity: NSFWSeverityLevel;
  context: string;
  metadata?: Record<string, any>;
}

/* ---------------------------------------------------------------------------
 * Guardrail Config
 * ------------------------------------------------------------------------- */
export interface NSFWGuardrailConfig {
  severityThreshold?: NSFWSeverityLevel;
  enableContextAnalysis?: boolean;
  requireAgeVerification?: boolean;
  allowMedicalEducational?: boolean;
  enableObfuscationDetection?: boolean;
  customBlocklist?: string[];
  customAllowlist?: string[];
  minConfidence?: number;
  enableTelemetry?: boolean;
}

/* ---------------------------------------------------------------------------
 * Guardrail Implementation
 * ------------------------------------------------------------------------- */
export class NSFWAdvancedGuardrail extends BaseGuardrail<NSFWGuardrailConfig> {
  /* ------------------------- Regex Pattern Stores ------------------------ */

  private level3Explicit: Record<string, RegExp[]> = {};
  private level2Contextual: Record<string, RegExp[]> = {};
  private level1Restricted: Record<string, RegExp[]> = {};
  private level0Medical: Record<string, RegExp[]> = {};

  private medicalIndicators: RegExp[] = [];
  private educationalIndicators: RegExp[] = [];
  private eroticIntentIndicators: RegExp[] = [];
  private roleplayIndicators: RegExp[] = [];

  private obfuscationPatterns: {
    separation: RegExp[];
    misspellings: RegExp[];
  } = { separation: [], misspellings: [] };

  private blocklist: Set<string>;
  private allowlist: Set<string>;

  constructor(config: NSFWGuardrailConfig = {}) {
    super('NSFWAdvancedGuardrail', 'input', config);

    this.blocklist = new Set(config.customBlocklist ?? []);
    this.allowlist = new Set(config.customAllowlist ?? []);

    this.initDetectionPatterns();
    this.initContextPatterns();
    this.initObfuscationPatterns();
  }

  /* -----------------------------------------------------------------------
   * Public Entry Point
   * --------------------------------------------------------------------- */
  execute(text: string, context: GuardrailContext = {}) {
    if (!text || typeof text !== 'string') {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'Empty or invalid input',
      });
    }

    const normalized = this.normalize(text);
    const signals: NSFWDetectionSignal[] = [];

    // 1. Blocklist
    const blockSignal = this.checkBlocklist(normalized);
    if (blockSignal) signals.push(blockSignal);

    // 2. Pattern tiers
    signals.push(...this.checkTier(normalized, this.level3Explicit, NSFWSeverityLevel.LEVEL_3_CRITICAL, 0.95));
    signals.push(...this.checkTier(normalized, this.level2Contextual, NSFWSeverityLevel.LEVEL_2_CONTEXTUAL, 0.75));
    signals.push(...this.checkTier(normalized, this.level1Restricted, NSFWSeverityLevel.LEVEL_1_RESTRICTED, 0.6));

    // 3. Obfuscation
    if (this.config.enableObfuscationDetection !== false) {
      signals.push(...this.checkObfuscation(text, normalized));
    }

    // 4. Context analysis
    let contextModifier = this.config.enableContextAnalysis === false
      ? 1.0
      : this.analyzeContext(normalized, context);

    // 5. Medical/Educational exemption
    if (
      this.config.allowMedicalEducational !== false &&
      this.isMedicalEducationalContext(normalized)
    ) {
      contextModifier *= 0.3;
    }

    // 6. Ensemble decision
    const decision = this.makeDecision(
      signals,
      contextModifier,
      context
    );

    // 7. Final result
    return this.buildResult(decision, signals, text, context);
  }

  /* =========================================================================
   * Detection Logic
   * ========================================================================= */

  private normalize(text: string): string {
    return text.toLowerCase().replace(/\s+/g, ' ').trim();
  }

  private checkBlocklist(content: string): NSFWDetectionSignal | null {
    for (const term of this.blocklist) {
      if (content.includes(term.toLowerCase())) {
        return {
          signalType: 'custom_blocklist',
          confidence: 1.0,
          matchedTerms: [term],
          severity: NSFWSeverityLevel.LEVEL_3_CRITICAL,
          context: 'Custom blocklist match',
        };
      }
    }
    return null;
  }

  private checkTier(
    content: string,
    tier: Record<string, RegExp[]>,
    severity: NSFWSeverityLevel,
    confidence: number
  ): NSFWDetectionSignal[] {
    const signals: NSFWDetectionSignal[] = [];
    for (const [category, patterns] of Object.entries(tier)) {
      for (const regex of patterns) {
        const matches = content.match(regex);
        if (matches?.length) {
          signals.push({
            signalType: `${NSFWSeverityLevel[severity]}_${category}`,
            confidence,
            matchedTerms: matches.slice(0, 5),
            severity,
            context: `Matched ${category}`,
          });
        }
      }
    }
    return signals;
  }

  private checkObfuscation(original: string, normalized: string): NSFWDetectionSignal[] {
    const signals: NSFWDetectionSignal[] = [];

    for (const rx of this.obfuscationPatterns.separation) {
      if (rx.test(original)) {
        signals.push({
          signalType: 'obfuscation_separation',
          confidence: 0.85,
          matchedTerms: [rx.source],
          severity: NSFWSeverityLevel.LEVEL_3_CRITICAL,
          context: 'Character separation detected',
        });
      }
    }

    for (const rx of this.obfuscationPatterns.misspellings) {
      if (rx.test(normalized)) {
        signals.push({
          signalType: 'obfuscation_misspelling',
          confidence: 0.8,
          matchedTerms: [rx.source],
          severity: NSFWSeverityLevel.LEVEL_3_CRITICAL,
          context: 'Misspelled NSFW term detected',
        });
      }
    }

    return signals;
  }

  /* =========================================================================
   * Context Analysis
   * ========================================================================= */

  private analyzeContext(content: string, context: GuardrailContext): number {
    let modifier = 1.0;

    const medicalHits = this.medicalIndicators.filter(r => r.test(content)).length;
    const eduHits = this.educationalIndicators.filter(r => r.test(content)).length;

    if (medicalHits >= 2 || eduHits >= 2) modifier *= 0.5;

    if (this.eroticIntentIndicators.some(r => r.test(content))) modifier *= 1.3;
    if (this.roleplayIndicators.filter(r => r.test(content)).length >= 2) modifier *= 1.4;

    if (context.ageVerified) modifier *= 0.8;
    if ((context as any).priorViolations > 0) modifier *= 1.2;

    return Math.max(0, Math.min(1.5, modifier));
  }

  private isMedicalEducationalContext(content: string): boolean {
    let score = 0;
    for (const patterns of Object.values(this.level0Medical)) {
      for (const r of patterns) {
        if (r.test(content)) score++;
      }
    }
    return score >= 2;
  }

  /* =========================================================================
   * Ensemble Decision
   * ========================================================================= */

  private makeDecision(
    signals: NSFWDetectionSignal[],
    modifier: number,
    context: GuardrailContext
  ) {
    if (!signals.length) {
      return {
        severity: NSFWSeverityLevel.LEVEL_0_ALLOWED,
        confidence: 1.0,
        action: 'ALLOW' as GuardrailAction,
        reasoning: 'No NSFW content detected',
      };
    }

    const scores = {
      [NSFWSeverityLevel.LEVEL_3_CRITICAL]: 0,
      [NSFWSeverityLevel.LEVEL_2_CONTEXTUAL]: 0,
      [NSFWSeverityLevel.LEVEL_1_RESTRICTED]: 0,
    };

    let maxConfidence = 0;
    for (const s of signals) {
      const adjusted = s.confidence * modifier;
      scores[s.severity] += adjusted;
      maxConfidence = Math.max(maxConfidence, adjusted);
    }

    const minConfidence = this.config.minConfidence ?? 0.7;

    if (scores[NSFWSeverityLevel.LEVEL_3_CRITICAL] > 0) {
      return {
        severity: NSFWSeverityLevel.LEVEL_3_CRITICAL,
        confidence: Math.max(maxConfidence, 0.9),
        action: 'BLOCK' as GuardrailAction,
        reasoning: 'Explicit sexual content detected',
      };
    }

    if (scores[NSFWSeverityLevel.LEVEL_2_CONTEXTUAL] > minConfidence) {
      if (this.config.requireAgeVerification && !context.ageVerified) {
        return {
          severity: NSFWSeverityLevel.LEVEL_2_CONTEXTUAL,
          confidence: maxConfidence,
          action: 'BLOCK' as GuardrailAction,
          reasoning: 'Age verification required',
        };
      }
      return {
        severity: NSFWSeverityLevel.LEVEL_2_CONTEXTUAL,
        confidence: maxConfidence,
        action: 'WARN' as GuardrailAction,
        reasoning: 'Mature content detected',
      };
    }

    if (scores[NSFWSeverityLevel.LEVEL_1_RESTRICTED] > minConfidence) {
      return {
        severity: NSFWSeverityLevel.LEVEL_1_RESTRICTED,
        confidence: maxConfidence,
        action: 'ALLOW' as GuardrailAction,
        reasoning: 'Mature themes allowed',
      };
    }

    return {
      severity: NSFWSeverityLevel.LEVEL_0_ALLOWED,
      confidence: maxConfidence,
      action: 'ALLOW' as GuardrailAction,
      reasoning: 'Content appears safe',
    };
  }

  /* =========================================================================
   * Result Builder
   * ========================================================================= */

  private buildResult(
    decision: any,
    signals: NSFWDetectionSignal[],
    original: string,
    context: GuardrailContext
  ) {
    const severityMap = {
      [NSFWSeverityLevel.LEVEL_0_ALLOWED]: 'info',
      [NSFWSeverityLevel.LEVEL_1_RESTRICTED]: 'warning',
      [NSFWSeverityLevel.LEVEL_2_CONTEXTUAL]: 'warning',
      [NSFWSeverityLevel.LEVEL_3_CRITICAL]: 'critical',
    } as const;

    return this.result({
      passed: decision.action !== 'BLOCK',
      action: decision.action,
      severity: severityMap[decision.severity],
      message: decision.action === 'WARN'
        ? `Warning: ${decision.reasoning}`
        : decision.reasoning,
      details: {
        nsfwLevel: NSFWSeverityLevel[decision.severity],
        confidence: Number(decision.confidence.toFixed(3)),
        signalsDetected: signals.length,
        signals: signals.slice(0, 5),
        telemetry: this.config.enableTelemetry !== false
          ? {
              contentLength: original.length,
              timestamp: new Date().toISOString(),
              version: '2.0.0',
            }
          : undefined,
      },
    });
  }

  /* =========================================================================
   * Pattern Initialization
   * ========================================================================= */

  private initDetectionPatterns() {
    this.level3Explicit = {
      sexual_acts: [
        /\b(intercourse|penetration|oral\s+sex|fellatio|cunnilingus)\b/i,
        /\b(masturbat(e|ion|ing)|orgasm|ejaculat(e|ion))\b/i,
      ],
      pornographic: [
        /\b(porn|pornography|xxx|adult\s+content)\b/i,
      ],
    };

    this.level2Contextual = {
      sexual_themes: [
        /\b(sexual|erotic|sensual|seductive|horny)\b/i,
      ],
    };

    this.level1Restricted = {
      mature: [
        /\b(kiss(ing)?|attraction|desire)\b/i,
      ],
    };

    this.level0Medical = {
      medical: [
        /\b(medical|clinical|diagnosis|treatment)\b/i,
      ],
      educational: [
        /\b(education|textbook|biology|anatomy)\b/i,
      ],
    };
  }

  private initContextPatterns() {
    this.medicalIndicators = [
      /\b(doctor|hospital|patient|therapy)\b/i,
    ];
    this.educationalIndicators = [
      /\b(university|student|lecture|course)\b/i,
    ];
    this.eroticIntentIndicators = [
      /\b(turned\s+on|fantasize|aroused)\b/i,
    ];
    this.roleplayIndicators = attachment
      ? [] : [/\b(roleplay|scenario|fictional)\b/i];
  }

  private initObfuscationPatterns() {
    this.obfuscationPatterns = {
      separation: [
        /\bp\s*[._-]?\s*o\s*[._-]?\s*r\s*[._-]?\s*n\b/i,
      ],
      misspellings: [
        /\bp[o0]rn\b/i,
        /\bs[e3]x\b/i,
      ],
    };
  }
}
