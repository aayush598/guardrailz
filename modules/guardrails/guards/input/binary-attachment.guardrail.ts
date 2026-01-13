import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';

export interface BinaryAttachmentGuardrailConfig {
  /** Minimum length to consider something a payload */
  minPayloadLength?: number;

  /** Allow base64 if explicitly enabled */
  allowBase64?: boolean;

  /** Allow data URLs if explicitly enabled */
  allowDataUrls?: boolean;
}

export class BinaryAttachmentGuardrail extends BaseGuardrail<BinaryAttachmentGuardrailConfig> {
  private readonly minLength: number;

  constructor(config: unknown = {}) {
    const resolved = (config ?? {}) as BinaryAttachmentGuardrailConfig;
    super('BinaryAttachment', 'input', resolved);
    this.minLength = resolved.minPayloadLength ?? 256;
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

    const trimmed = text.trim();

    // 1. Data URLs (highest confidence)
    if (!this.config.allowDataUrls && this.isDataUrl(trimmed)) {
      return this.block('Data URL / embedded file detected', 'data_url');
    }

    // 2. Base64 blobs
    if (!this.config.allowBase64 && this.isBase64Payload(trimmed)) {
      return this.block('Base64-encoded binary payload detected', 'base64');
    }

    // 3. Binary / high-entropy text
    if (this.looksBinary(trimmed)) {
      return this.block('Binary or encoded attachment detected', 'binary');
    }

    return this.result({
      passed: true,
      action: 'ALLOW',
      severity: 'info',
    });
  }

  /* =========================================================================
   * Detection helpers
   * ========================================================================= */

  private isDataUrl(text: string): boolean {
    return /^data:[^;]+;base64,[a-z0-9+/=]+$/i.test(text);
  }

  private isBase64Payload(text: string): boolean {
    if (text.length < this.minLength) return false;
    if (text.length % 4 !== 0) return false;

    // Reject obvious natural language
    if (/\s/.test(text)) return false;

    const base64Regex = /^[A-Za-z0-9+/]+=*$/;
    return base64Regex.test(text);
  }

  private looksBinary(text: string): boolean {
    if (text.length < this.minLength) return false;

    let nonPrintable = 0;
    for (let i = 0; i < text.length; i++) {
      const c = text.charCodeAt(i);
      if (
        (c < 9 || c > 126) &&
        c !== 10 && // newline
        c !== 13 // carriage return
      ) {
        nonPrintable++;
      }
    }

    const ratio = nonPrintable / text.length;
    return ratio > 0.15;
  }

  private block(reason: string, type: string) {
    return this.result({
      passed: false,
      action: 'BLOCK',
      severity: 'error',
      message: reason,
      metadata: {
        detectionType: type,
      },
    });
  }
}
