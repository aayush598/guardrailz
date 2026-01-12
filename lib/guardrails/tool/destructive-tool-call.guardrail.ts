import { BaseGuardrail } from '../core/base';
import { GuardrailContext } from '../core/context';
import { GuardrailAction, GuardrailSeverity } from '../core/types';

/* ========================================================================== */
/* 1. Types & Config                                                          */
/* ========================================================================== */

export interface DestructiveToolCallConfig {
  /**
   * Explicitly allowed destructive tools (escape hatch)
   */
  allowlist?: string[];

  /**
   * Whether WARN is allowed instead of BLOCK
   */
  warnOnly?: boolean;
}

/* ========================================================================== */
/* 2. Guardrail Implementation                                                */
/* ========================================================================== */

export class DestructiveToolCallGuardrail extends BaseGuardrail<DestructiveToolCallConfig> {
  private readonly destructivePatterns: RegExp[] = [
    // File system
    /\brm\s+-rf\b/i,
    /\bdelete\s+file\b/i,
    /\bunlink\b/i,

    // Database
    /\bdrop\s+database\b/i,
    /\bdrop\s+table\b/i,
    /\btruncate\s+table\b/i,

    // Infrastructure
    /\bterraform\s+destroy\b/i,
    /\bkubectl\s+delete\b/i,
    /\bhelm\s+uninstall\b/i,

    // OS / shell
    /\bexec\b/i,
    /\beval\b/i,
    /\bsudo\b/i,

    // Wildcards
    /\b\*\b/,
  ];

  constructor(config: DestructiveToolCallConfig = {}) {
    super('DestructiveToolCall', 'tool', config);
  }

  execute(_: string, context: GuardrailContext) {
    const toolAccess = (context as any)?.toolAccess;

    // Not a tool invocation
    if (!toolAccess) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'No tool invocation detected',
      });
    }

    const { toolName, toolArgs } = toolAccess;

    // Explicit allowlist
    if (this.config.allowlist?.includes(toolName)) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: `Tool '${toolName}' explicitly allowlisted`,
      });
    }

    const serializedArgs = JSON.stringify(toolArgs ?? {});
    const combined = `${toolName} ${serializedArgs}`;

    const matchedPattern = this.destructivePatterns.find((rx) => rx.test(combined));

    if (!matchedPattern) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'No destructive behavior detected',
      });
    }

    const action: GuardrailAction = this.config.warnOnly === true ? 'WARN' : 'BLOCK';

    const severity: GuardrailSeverity = action === 'WARN' ? 'warning' : 'critical';

    return this.result({
      passed: action !== 'BLOCK',
      action,
      severity,
      message: 'Destructive tool invocation detected',
      metadata: {
        toolName,
        matchedPattern: matchedPattern.source,
      },
    });
  }
}
