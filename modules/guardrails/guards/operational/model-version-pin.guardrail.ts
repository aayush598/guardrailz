import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';
import { GuardrailContext } from '../../engine/context';

/* ============================================================================
 * Config
 * ========================================================================== */

export interface ModelVersionPinConfig {
  /**
   * Explicitly allowed full model identifiers
   * Example: ['gpt-4.1-2024-11-20']
   */
  allowedModels: string[];

  /**
   * If true, blocks models without an explicit version suffix
   * Example: blocks "gpt-4", allows "gpt-4.1-2024-11-20"
   */
  requireExplicitVersion?: boolean;

  /**
   * If true, unknown models are blocked
   * If false, unknown models generate a WARN
   */
  strict?: boolean;
}

/* ============================================================================
 * Guardrail
 * ========================================================================== */

function normalizeModelVersionPinConfig(input: unknown): ModelVersionPinConfig {
  if (!input || typeof input !== 'object') {
    return {
      allowedModels: [],
      requireExplicitVersion: true,
      strict: true,
    };
  }

  const c = input as Partial<ModelVersionPinConfig>;

  return {
    allowedModels: Array.isArray(c.allowedModels) ? c.allowedModels : [],
    requireExplicitVersion: c.requireExplicitVersion ?? true,
    strict: c.strict ?? true,
  };
}

export class ModelVersionPinGuardrail extends BaseGuardrail<ModelVersionPinConfig> {
  constructor(config?: unknown) {
    const resolved = normalizeModelVersionPinConfig(config);

    super('ModelVersionPin', 'general', resolved);

    if (resolved.allowedModels.length === 0) {
      throw new Error('ModelVersionPinGuardrail requires allowedModels');
    }
  }

  execute(_: string, context: GuardrailContext) {
    const model = context.model;

    if (!model || typeof model !== 'string') {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'No model specified',
      });
    }

    const { allowedModels, requireExplicitVersion = true, strict = true } = this.config;

    const hasExplicitVersion = /-\d{4}-\d{2}-\d{2}$/.test(model);

    if (requireExplicitVersion && !hasExplicitVersion) {
      return this.result({
        passed: false,
        action: 'BLOCK',
        severity: 'error',
        message: `Model "${model}" is not version-pinned`,
        metadata: {
          model,
          allowedModels,
        },
      });
    }

    if (!allowedModels.includes(model)) {
      if (strict) {
        return this.result({
          passed: false,
          action: 'BLOCK',
          severity: 'error',
          message: `Model "${model}" is not in the allowed model list`,
          metadata: {
            model,
            allowedModels,
          },
        });
      }

      return this.result({
        passed: true,
        action: 'WARN',
        severity: 'warning',
        message: `Model "${model}" is not explicitly pinned but allowed by policy`,
        metadata: {
          model,
          allowedModels,
        },
      });
    }

    return this.result({
      passed: true,
      action: 'ALLOW',
      severity: 'info',
      message: `Model "${model}" is explicitly pinned`,
      metadata: {
        model,
      },
    });
  }
}
