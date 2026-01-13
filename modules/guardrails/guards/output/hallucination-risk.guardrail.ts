import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';

/* -------------------------------------------------------------------------- */
/* Configuration                                                              */
/* -------------------------------------------------------------------------- */

export interface HallucinationRiskConfig {
  warnThreshold?: number; // default: 0.4
  blockThreshold?: number; // default: 0.75
  requireCitations?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Guardrail                                                                  */
/* -------------------------------------------------------------------------- */

export class HallucinationRiskGuardrail extends BaseGuardrail<HallucinationRiskConfig> {
  constructor(config?: unknown) {
    const resolved = (config ?? {}) as HallucinationRiskConfig;
    super('HallucinationRisk', 'output', resolved);
  }

  execute(text: string) {
    if (!text || typeof text !== 'string') {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'Empty output',
      });
    }

    const signals = this.detectSignals(text);
    const score = this.computeRiskScore(signals);

    const warnAt = this.config.warnThreshold ?? 0.4;
    const blockAt = this.config.blockThreshold ?? 0.75;

    // 1️⃣ BLOCK always wins
    if (score >= blockAt) {
      return this.result({
        passed: false,
        action: 'BLOCK',
        severity: 'critical',
        message: 'High hallucination risk detected',
        metadata: { score, signals },
      });
    }

    // 2️⃣ Hard WARN signals (floor)
    const hardWarnSignals = new Set(['unverified_research_claim', 'missing_citations']);

    if (signals.some((s) => hardWarnSignals.has(s))) {
      return this.result({
        passed: true,
        action: 'WARN',
        severity: 'warning',
        message: 'Unverified factual claim detected',
        metadata: { score, signals },
      });
    }

    // 3️⃣ Score-based WARN
    if (score >= warnAt) {
      return this.result({
        passed: true,
        action: 'WARN',
        severity: 'warning',
        message: 'Possible hallucination risk detected',
        metadata: { score, signals },
      });
    }

    // 4️⃣ ALLOW
    return this.result({
      passed: true,
      action: 'ALLOW',
      severity: 'info',
      message: 'Low hallucination risk',
      metadata: { score, signals },
    });
  }

  /* ------------------------------------------------------------------------ */
  /* Signal detection                                                         */
  /* ------------------------------------------------------------------------ */

  private detectSignals(text: string) {
    const signals: string[] = [];
    const normalized = text.toLowerCase();

    const hasResearchClaim =
      /\b(studies show|research indicates|experts say|according to research)\b/.test(normalized);

    if (hasResearchClaim && !this.hasCitation(text)) {
      signals.push('unverified_research_claim');
    }

    if (/\b\d{4}\b/.test(text) && !this.hasCitation(text)) {
      signals.push('precise_date_without_citation');
    }

    if (/\b(always|never|guaranteed|definitely|proven)\b/.test(normalized)) {
      signals.push('overconfident_language');
    }

    if (/\b(i think|i guess|not sure).*\b(definitely|certainly)\b/.test(normalized)) {
      signals.push('hedging_conflict');
    }

    if (this.config.requireCitations && !this.hasCitation(text)) {
      signals.push('missing_citations');
    }

    return signals;
  }

  private hasCitation(text: string): boolean {
    return /\[(\d+|source|ref)\]|\bhttps?:\/\//i.test(text);
  }

  private computeRiskScore(signals: string[]): number {
    if (signals.length === 0) return 0;

    const weights: Record<string, number> = {
      unverified_research_claim: 0.3,
      precise_date_without_citation: 0.2,
      overconfident_language: 0.2,
      hedging_conflict: 0.2,
      missing_citations: 0.3,
    };

    return Math.min(
      1,
      signals.reduce((sum, s) => sum + (weights[s] ?? 0.1), 0),
    );
  }
}
