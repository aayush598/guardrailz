import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';

import { GuardrailAction } from '@/modules/guardrails/engine/types';

/* ============================================================================
 * Config
 * ========================================================================= */

export interface CitationRequiredConfig {
  /**
   * If true, missing citations will BLOCK instead of WARN
   */
  requireCitations?: boolean;

  /**
   * Minimum number of citations required
   */
  minCitations?: number;

  /**
   * Disable guardrail entirely
   */
  enabled?: boolean;
}

/* ============================================================================
 * Guardrail
 * ========================================================================= */

export class CitationRequiredGuardrail extends BaseGuardrail<CitationRequiredConfig> {
  constructor(config?: unknown) {
    const resolved = (config ?? {}) as CitationRequiredConfig;
    super('CitationRequired', 'output', resolved);
  }

  execute(text: string) {
    if (this.config.enabled === false) {
      return this.allow('Guardrail disabled');
    }

    if (!text || typeof text !== 'string') {
      return this.allow('Empty or non-text output');
    }

    const hasFactualClaims = detectFactualClaims(text);

    if (!hasFactualClaims) {
      return this.allow('No factual claims detected');
    }

    const citations = extractCitations(text);
    const minRequired = this.config.minCitations ?? 1;

    if (citations.length >= minRequired) {
      return this.allow('Citations present', {
        citationsFound: citations.length,
      });
    }

    const action: GuardrailAction = this.config.requireCitations ? 'BLOCK' : 'WARN';

    return this.result({
      passed: action !== 'BLOCK',
      action,
      severity: 'warning',
      message: `Factual claims detected without required citations (found ${citations.length}, required ${minRequired})`,
      metadata: {
        citationsFound: citations.length,
        required: minRequired,
        detectedPatterns: citations,
      },
    });
  }

  /* =========================================================================
   * Helpers
   * ========================================================================= */

  private allow(message: string, metadata?: Record<string, unknown>) {
    return this.result({
      passed: true,
      action: 'ALLOW',
      severity: 'info',
      message,
      metadata,
    });
  }
}

/* ============================================================================
 * Detection Logic (Pure Functions → Testable)
 * ========================================================================= */

/**
 * Heuristic detection of factual claims
 * Conservative by design
 */
export function detectFactualClaims(text: string): boolean {
  const factualPatterns = [
    /\b(is|are|was|were)\b\s+\d+/i, // "X is 10"
    /\baccording to\b/i,
    /\bstud(y|ies) show\b/i,
    /\bresearch indicates\b/i,
    /\bstatistics show\b/i,
    /\bfounded in\b/i,
    /\bthe capital of\b/i,
    /\bwas born in\b/i,
  ];

  return factualPatterns.some((rx) => rx.test(text));
}

/**
 * Extracts citations/sources
 */
export function extractCitations(text: string): string[] {
  const patterns = [
    /\bhttps?:\/\/\S+/gi, // URLs
    /\[[0-9]+\]/g, // [1]
    /\[[^\]]+\]\([^)]+\)/g, // Markdown links
    /\b(source|according to):?\b/gi, // source:
  ];

  const matches = new Set<string>();

  for (const rx of patterns) {
    const found = text.match(rx);
    if (found) {
      found.forEach((f) => matches.add(f));
    }
  }

  return Array.from(matches);
}
