import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';

export interface RightToErasureConfig {
  /** Minimum confidence score required to trigger */
  minConfidence?: number;
  /** Whether to attach regulatory references */
  includeLegalBasis?: boolean;
}

interface ErasureSignal {
  phrase: string;
  confidence: number;
  category: 'explicit' | 'implicit' | 'regulatory';
}

export class RightToErasureGuardrail extends BaseGuardrail<RightToErasureConfig> {
  private readonly patterns: Array<{
    regex: RegExp;
    confidence: number;
    category: ErasureSignal['category'];
  }> = [
    // Explicit user intent
    {
      regex:
        /\b(delete|erase|remove)\s+(all\s+)?(my|our)\s+(personal|private|user\s+)?(data|information|account)\b/i,
      confidence: 0.95,
      category: 'explicit',
    },
    {
      regex: /\b(right\s+to\s+be\s+forgotten)\b/i,
      confidence: 0.98,
      category: 'explicit',
    },

    // Regulatory language
    {
      regex: /\b(gdpr|article\s*17|data\s+subject\s+request)\b/i,
      confidence: 0.9,
      category: 'regulatory',
    },

    // Implicit intent
    {
      regex: /\b(stop\s+storing|remove\s+everything|delete\s+profile)\b/i,
      confidence: 0.7,
      category: 'implicit',
    },
  ];

  constructor(config: unknown = {}) {
    const resolved = (config ?? {}) as RightToErasureConfig;
    super('RightToErasure', 'input', resolved);
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

    const signals = this.detectSignals(text);
    if (!signals.length) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'No erasure request detected',
      });
    }

    const strongest = signals.sort((a, b) => b.confidence - a.confidence)[0];
    const minConfidence = this.config.minConfidence ?? 0.75;

    if (strongest.confidence < minConfidence) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'Low-confidence erasure signal ignored',
        metadata: { signals },
      });
    }

    return this.result({
      passed: true,
      action: 'WARN',
      severity: 'warning',
      message: 'GDPR right-to-erasure request detected',
      metadata: {
        requestType: 'right_to_erasure',
        confidence: strongest.confidence,
        category: strongest.category,
        signals,
        legalBasis: this.config.includeLegalBasis !== false ? ['GDPR Article 17'] : undefined,
        recommendedAction: 'Route to DSAR / privacy workflow',
      },
    });
  }

  private detectSignals(text: string): ErasureSignal[] {
    const t = text.toLowerCase();

    const signals: ErasureSignal[] = [];

    const hasDeleteVerb = /\b(delete|erase|remove|forget)\b/.test(t);

    const hasOwnership = /\b(my|our)\b/.test(t);

    const hasDataObject = /\b(data|information|account|profile)\b/.test(t);

    const hasRegulatoryLanguage =
      /\b(gdpr|article\s*17|right\s+to\s+be\s+forgotten|data\s+subject\s+request)\b/.test(t);

    // Explicit GDPR erasure request
    if (hasDeleteVerb && hasOwnership && hasDataObject) {
      signals.push({
        phrase: 'explicit_erasure_request',
        confidence: 0.95,
        category: 'explicit',
      });
    }

    // Regulatory / legal phrasing
    if (hasRegulatoryLanguage) {
      signals.push({
        phrase: 'gdpr_regulatory_language',
        confidence: 0.9,
        category: 'regulatory',
      });
    }

    // Implicit erasure intent
    if (hasDeleteVerb && hasDataObject && !hasOwnership) {
      signals.push({
        phrase: 'implicit_erasure_request',
        confidence: 0.7,
        category: 'implicit',
      });
    }

    return signals;
  }
}
