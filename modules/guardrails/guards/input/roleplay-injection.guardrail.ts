import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';
import type { GuardrailAction, GuardrailSeverity } from '@/modules/guardrails/engine/types';

export interface RoleplayInjectionConfig {
  /**
   * If true, allows benign fictional roleplay (stories, novels, games)
   */
  allowFictionalRoleplay?: boolean;

  /**
   * Action to take when roleplay injection is detected
   */
  action?: GuardrailAction;

  /**
   * Severity to report
   */
  severity?: GuardrailSeverity;
}

export class RoleplayInjectionGuardrail extends BaseGuardrail<RoleplayInjectionConfig> {
  private readonly patterns: RegExp[];

  constructor(config: unknown = {}) {
    const resolved = (config ?? {}) as RoleplayInjectionConfig;
    super('RoleplayInjection', 'input', resolved);

    this.patterns = [
      // Persona / identity switching
      /\b(act as|pretend to be|roleplay as|you are now|assume the role of)\b/i,

      // Jailbreak-style fictional personas
      /\b(unrestricted ai|without limitations|no rules apply|ignore all rules)\b/i,

      // Explicit roleplay framing
      /\b(this is (just )?a roleplay|fictional scenario where rules don'?t apply)\b/i,

      // DAN / jailbreak personas
      /\b(DAN|Do Anything Now|jailbreak mode)\b/i,
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

    const normalized = text.toLowerCase();
    const matches = this.patterns.filter((rx) => rx.test(normalized));

    if (!matches.length) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
      });
    }

    // Optional allowance for harmless fictional storytelling
    if (this.config.allowFictionalRoleplay) {
      return this.result({
        passed: true,
        action: 'WARN',
        severity: 'warning',
        message: 'Roleplay detected but allowed by configuration',
        metadata: {
          patternsMatched: matches.map((m) => m.source),
        },
      });
    }

    const action = this.config.action ?? 'BLOCK';
    const severity = this.config.severity ?? 'error';

    return this.result({
      passed: action !== 'BLOCK',
      action,
      severity,
      message: 'Roleplay-based prompt injection attempt detected',
      metadata: {
        patternsMatched: matches.map((m) => m.source),
        count: matches.length,
      },
    });
  }
}
