import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';

export interface PromptInjectionConfig {
  /** Minimum number of matched patterns to block */
  blockThreshold?: number;
  /** If false, guardrail is effectively disabled */
  enabled?: boolean;
}

interface InjectionMatch {
  pattern: string;
  match: string;
  category: string;
}

export class PromptInjectionSignatureGuardrail extends BaseGuardrail<PromptInjectionConfig> {
  private readonly patterns: Record<string, RegExp[]>;

  constructor(config: unknown = {}) {
    const resolved = (config ?? {}) as PromptInjectionConfig;
    super('PromptInjectionSignature', 'input', resolved);

    this.patterns = {
      override: [
        /\b(ignore|disregard|bypass)\b.*\b(instruction(s)?|rule(s)?|policy|guideline(s)?)\b/i,
        /\b(do not|don't)\b.*\b(follow|obey)\b.*\b(instruction(s)?|rule(s)?)\b/i,
      ],

      role_escalation: [
        /\b(you are now|act as|pretend to be)\b.*\b(system|developer|admin)\b/i,
        /\b(system prompt|developer message)\b/i,
      ],
      jailbreak_templates: [
        /\bDAN\b.*\b(do anything now)\b/i,
        /\bno restrictions\b/i,
        /\bwithout limitations\b/i,
      ],
      safety_bypass: [/\bdisable\b.*\b(safety|filter|moderation)\b/i, /\buncensored\b/i],
    };
  }

  execute(text: string) {
    if (!this.config.enabled && this.config.enabled !== undefined) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'Prompt injection guardrail disabled',
      });
    }

    if (!text || typeof text !== 'string') {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'Empty or invalid input',
      });
    }

    const matches = this.detect(text);

    if (matches.length === 0) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
      });
    }

    const blockThreshold = this.config.blockThreshold ?? 1;
    const shouldBlock = matches.length >= blockThreshold;

    return this.result({
      passed: !shouldBlock,
      action: shouldBlock ? 'BLOCK' : 'WARN',
      severity: shouldBlock ? 'error' : 'warning',
      message: shouldBlock
        ? 'Prompt injection attempt detected'
        : 'Potential prompt injection pattern detected',
      metadata: {
        matches,
        totalMatches: matches.length,
      },
    });
  }

  private detect(text: string): InjectionMatch[] {
    const normalized = text.toLowerCase();
    const results: InjectionMatch[] = [];

    for (const [category, regexes] of Object.entries(this.patterns)) {
      for (const rx of regexes) {
        const match = normalized.match(rx);
        if (match) {
          results.push({
            category,
            pattern: rx.source,
            match: match[0],
          });
        }
      }
    }

    return results;
  }
}
