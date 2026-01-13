import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';

export interface SystemPromptLeakConfig {
  /**
   * If true, contextual mentions (e.g. academic discussion)
   * downgrade BLOCK → WARN
   */
  allowBenignContext?: boolean;
}

export class SystemPromptLeakGuardrail extends BaseGuardrail<SystemPromptLeakConfig> {
  private readonly patterns: RegExp[];

  constructor(config: unknown = {}) {
    const resolved = (config ?? {}) as SystemPromptLeakConfig;
    super('SystemPromptLeak', 'input', resolved);

    this.patterns = [
      // Direct requests
      /\b(system prompt|developer prompt|hidden prompt)\b/i,
      /\b(show|print|reveal|dump)\s+(the\s+)?(system|developer|hidden)\b/i,

      // Instruction override attempts
      /\b(ignore|bypass|override)\s+(all\s+)?(previous|earlier|system)\s+instructions\b/i,

      // Introspection / extraction
      /\bwhat\s+(are|is)\s+(your|the)\s+(instructions|rules|prompt)\b/i,
      /\bhow\s+are\s+you\s+configured\b/i,

      // Security probing
      /\binternal\s+(policy|rules|configuration)\b/i,
      /\bconfidential\s+prompt\b/i,
    ];
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

    const matches = this.patterns.filter((rx) => rx.test(text));

    if (!matches.length) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
      });
    }

    // Optional contextual downgrade
    if (this.config.allowBenignContext) {
      return this.result({
        passed: true,
        action: 'WARN',
        severity: 'warning',
        message: 'Potential system prompt probing detected',
        metadata: {
          matches: matches.map((m) => m.source),
        },
      });
    }

    return this.result({
      passed: false,
      action: 'BLOCK',
      severity: 'error',
      message: 'Attempt to extract system or developer instructions detected',
      metadata: {
        matches: matches.map((m) => m.source),
      },
    });
  }
}
