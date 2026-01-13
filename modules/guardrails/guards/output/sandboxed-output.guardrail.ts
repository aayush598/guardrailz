import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';

/* -------------------------------------------------------------------------- */
/* Config                                                                      */
/* -------------------------------------------------------------------------- */

export interface SandboxedOutputConfig {
  mode?: 'BLOCK' | 'MODIFY';
  extraPatterns?: RegExp[];
}

/* -------------------------------------------------------------------------- */
/* Guardrail                                                                   */
/* -------------------------------------------------------------------------- */

export class SandboxedOutputGuardrail extends BaseGuardrail<SandboxedOutputConfig> {
  private readonly patterns: RegExp[];

  constructor(config?: unknown) {
    const resolved = (config ?? {}) as SandboxedOutputConfig;
    super('SandboxedOutput', 'output', resolved);

    this.patterns = [
      // Shell commands (anywhere, not line-anchored)
      /\b(rm|sudo|chmod|chown|curl|wget|scp|ssh)\b\s+/i,

      // Inline execution environments
      /\b(bash|sh|powershell|cmd\.exe)\b/i,

      // Dangerous filesystem paths
      /\b\/(etc|usr|bin|var|proc|sys)\b/i,

      // Code execution hints
      /\b(run|execute|eval|spawn|fork)\b\s*\(/i,

      // Script shebangs
      /^#!\/(usr\/bin|bin)\//m,

      // PowerShell execution
      /\bInvoke-Expression\b/i,

      ...(resolved.extraPatterns ?? []),
    ];
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

    const matches = this.findMatches(text);

    if (matches.length === 0) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'No executable content detected',
      });
    }

    if (this.config.mode === 'MODIFY') {
      return this.result({
        passed: true,
        action: 'MODIFY',
        severity: 'warning',
        message: 'Executable content redacted for sandbox safety',
        redactedText: this.redact(text),
        metadata: { matches },
      });
    }

    return this.result({
      passed: false,
      action: 'BLOCK',
      severity: 'error',
      message: 'Executable or actionable output detected',
      metadata: { matches },
    });
  }

  /* ------------------------------------------------------------------------ */
  /* Helpers                                                                  */
  /* ------------------------------------------------------------------------ */

  private findMatches(text: string): string[] {
    const hits: string[] = [];

    for (const rx of this.patterns) {
      const match = text.match(rx);
      if (match?.[0]) {
        hits.push(match[0]);
      }
    }

    return hits.slice(0, 5);
  }

  private redact(text: string): string {
    let result = text;

    for (const rx of this.patterns) {
      result = result.replace(rx, '[REDACTED_EXECUTABLE] ');
    }

    return result;
  }
}
