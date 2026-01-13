import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';

interface PIIPattern {
  name: string;
  regex: RegExp;
  replacement: string;
}

export class OutputPIIRedactionGuardrail extends BaseGuardrail {
  private readonly patterns: PIIPattern[] = [
    {
      name: 'Email',
      regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      replacement: '[EMAIL_REDACTED]',
    },
    {
      name: 'Phone Number',
      regex: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
      replacement: '[PHONE_REDACTED]',
    },
    {
      name: 'SSN',
      regex: /\b\d{3}-\d{2}-\d{4}\b/g,
      replacement: '[SSN_REDACTED]',
    },
    {
      name: 'Credit Card',
      regex: /\b(?:\d{4}[- ]?){3}\d{4}\b/g,
      replacement: '[CARD_REDACTED]',
    },
    {
      name: 'IPv4 Address',
      regex: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
      replacement: '[IP_REDACTED]',
    },
  ];

  constructor(config?: unknown) {
    super('OutputPIIRedaction', 'output', config ?? {});
  }

  execute(text: string) {
    let redactedText = text;
    const redactions: Array<{ type: string; count: number }> = [];

    for (const pattern of this.patterns) {
      const matches = text.match(pattern.regex);
      if (!matches || matches.length === 0) continue;

      redactedText = redactedText.replace(pattern.regex, pattern.replacement);
      redactions.push({
        type: pattern.name,
        count: matches.length,
      });
    }

    if (redactions.length > 0) {
      const total = redactions.reduce((sum, r) => sum + r.count, 0);

      return this.result({
        passed: true,
        severity: 'warning',
        action: 'MODIFY',
        message: `Redacted ${total} PII item(s) from output`,
        redactedText,
        metadata: {
          totalRedactions: total,
          breakdown: redactions,
        },
      });
    }

    return this.result({
      passed: true,
      severity: 'info',
      action: 'ALLOW',
      message: 'No PII detected in output',
      redactedText: text,
      metadata: {
        totalRedactions: 0,
      },
    });
  }
}
