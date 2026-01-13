import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';

/* -------------------------------------------------------------------------- */
/* Config                                                                      */
/* -------------------------------------------------------------------------- */
export interface EncodingObfuscationConfig {
  blockOnDecode?: boolean; // default true
  minEncodedLength?: number; // default 16
  confidenceThreshold?: number; // default 0.7
}

/* -------------------------------------------------------------------------- */
/* Guardrail                                                                   */
/* -------------------------------------------------------------------------- */
export class EncodingObfuscationGuardrail extends BaseGuardrail<EncodingObfuscationConfig> {
  constructor(config: unknown = {}) {
    const resolved = (config ?? {}) as EncodingObfuscationConfig;
    super('EncodingObfuscation', 'input', {
      blockOnDecode: true,
      minEncodedLength: 16,
      confidenceThreshold: 0.7,
      ...resolved,
    });
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

    const signals: string[] = [];
    let confidence = 0;

    // 1. Base64 detection
    if (this.isLikelyBase64(text)) {
      signals.push('base64_detected');
      confidence += 0.4;

      const decoded = this.safeBase64Decode(text);
      if (decoded) {
        signals.push('base64_decoded');
        confidence += 0.4;

        if (this.containsSensitiveKeyword(decoded)) {
          signals.push('decoded_sensitive_content');
          confidence += 0.4;
        }
      }
    }

    // 2. Hex encoding
    if (this.isLikelyHex(text)) {
      signals.push('hex_encoding_detected');
      confidence += 0.3;
    }

    // 3. Leetspeak / homoglyphs
    const normalized = this.normalizeLeetspeak(text);
    if (normalized !== text.toLowerCase()) {
      signals.push('leet_or_homoglyph');
      confidence += 0.3;

      if (this.containsSensitiveKeyword(normalized)) {
        signals.push('normalized_sensitive_content');
        confidence += 0.4;
      }
    }

    // Decision
    if (confidence >= this.config.confidenceThreshold!) {
      return this.result({
        passed: !this.config.blockOnDecode,
        action: this.config.blockOnDecode ? 'BLOCK' : 'WARN',
        severity: 'error',
        message: 'Obfuscated or encoded content detected',
        metadata: {
          confidence: Number(confidence.toFixed(2)),
          signals,
        },
      });
    }

    if (confidence > 0) {
      return this.result({
        passed: true,
        action: 'WARN',
        severity: 'warning',
        message: 'Potential obfuscation detected',
        metadata: { confidence, signals },
      });
    }

    return this.result({
      passed: true,
      action: 'ALLOW',
      severity: 'info',
    });
  }

  /* ------------------------------------------------------------------------ */
  /* Helpers                                                                  */
  /* ------------------------------------------------------------------------ */

  private isLikelyBase64(text: string): boolean {
    if (text.length < this.config.minEncodedLength!) return false;
    return /^[A-Za-z0-9+/=\s]+$/.test(text);
  }

  private safeBase64Decode(text: string): string | null {
    try {
      const buf = Buffer.from(text, 'base64');
      const decoded = buf.toString('utf8');
      return decoded.includes('\u0000') ? null : decoded;
    } catch {
      return null;
    }
  }

  private isLikelyHex(text: string): boolean {
    return /^(?:0x)?[0-9a-fA-F\s]+$/.test(text) && text.length > 16;
  }

  private normalizeLeetspeak(text: string): string {
    const map: Record<string, string> = {
      '0': 'o',
      '1': 'i',
      '3': 'e',
      '4': 'a',
      '5': 's',
      '7': 't',
      '@': 'a',
      $: 's',
    };

    return text
      .toLowerCase()
      .split('')
      .map((c) => map[c] ?? c)
      .join('');
  }

  private containsSensitiveKeyword(text: string): boolean {
    return /(password|secret|api[_-]?key|token|credential)/i.test(text);
  }
}
