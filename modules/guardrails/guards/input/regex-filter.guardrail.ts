import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';
import type { GuardrailAction, GuardrailSeverity } from '@/modules/guardrails/engine/types';

/* ============================================================================
 * Config Types
 * ========================================================================= */

export interface RegexFilterRule {
  pattern: string;
  flags?: string;
  action: GuardrailAction; // ALLOW | WARN | BLOCK
  message?: string;
}

export interface RegexFilterConfig {
  rules: RegexFilterRule[];
  defaultAction?: GuardrailAction; // default = ALLOW
}

/* ============================================================================
 * Guardrail
 * ========================================================================= */
function normalizeRegexFilterConfig(config: unknown): RegexFilterConfig {
  if (!config || typeof config !== 'object') {
    throw new Error('RegexFilterGuardrail requires a config object with a non-empty rules array');
  }

  const { rules, defaultAction } = config as Partial<RegexFilterConfig>;

  if (!Array.isArray(rules) || rules.length === 0) {
    throw new Error('RegexFilterGuardrail requires a non-empty "rules" array');
  }

  return {
    rules,
    defaultAction,
  };
}

export class RegexFilterGuardrail extends BaseGuardrail<RegexFilterConfig> {
  private compiledRules: Array<{
    regex: RegExp;
    rule: RegexFilterRule;
  }> = [];

  constructor(config?: unknown) {
    const validatedConfig = normalizeRegexFilterConfig(config);
    super('RegexFilter', 'input', validatedConfig);
    this.compileRules(validatedConfig.rules);
  }

  execute(text: string) {
    if (!text || typeof text !== 'string') {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'Empty input',
      });
    }

    for (const { regex, rule } of this.compiledRules) {
      if (regex.test(text)) {
        const isBlocked = rule.action === 'BLOCK';

        return this.result({
          passed: !isBlocked,
          action: rule.action,
          severity: this.mapSeverity(rule.action),
          message: rule.message ?? `Matched regex: ${rule.pattern}`,
          metadata: {
            pattern: rule.pattern,
            flags: rule.flags,
          },
        });
      }
    }

    // No matches
    return this.result({
      passed: true,
      action: this.config.defaultAction ?? 'ALLOW',
      severity: 'info',
      message: 'No regex rules matched',
    });
  }

  /* =========================================================================
   * Helpers
   * ========================================================================= */

  private compileRules(rules: RegexFilterRule[]) {
    for (const rule of rules) {
      try {
        const regex = new RegExp(rule.pattern, rule.flags);
        this.compiledRules.push({ regex, rule });
      } catch (err) {
        throw new Error(`Invalid regex pattern: ${rule.pattern}. Error : ${err}`);
      }
    }
  }

  private mapSeverity(action: GuardrailAction): GuardrailSeverity {
    switch (action) {
      case 'ALLOW':
        return 'info';
      case 'WARN':
        return 'warning';
      case 'BLOCK':
        return 'error';
      case 'MODIFY':
        return 'info'; // or 'warning' depending on semantics
      default: {
        const _exhaustive: never = action;
        return _exhaustive;
      }
    }
  }
}
