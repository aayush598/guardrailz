import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';
import type { GuardrailContext } from '@/modules/guardrails/engine/context';

/* -------------------------------------------------------------------------- */
/* Config                                                                      */
/* -------------------------------------------------------------------------- */

export interface TelemetryEnforcementConfig {
  /** Is telemetry mandatory */
  requireTelemetry?: boolean;

  /** Is audit logging mandatory */
  requireAuditLogging?: boolean;

  /** Allow WARN instead of BLOCK when missing */
  warnOnly?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Guardrail                                                                   */
/* -------------------------------------------------------------------------- */

export class TelemetryEnforcementGuardrail extends BaseGuardrail<TelemetryEnforcementConfig> {
  constructor(config: unknown = {}) {
    const resolved = (config ?? {}) as TelemetryEnforcementConfig;
    super('TelemetryEnforcement', 'general', resolved);
  }

  execute(_text: string, context: GuardrailContext) {
    const telemetry = context.telemetry;

    const requireTelemetry = this.config.requireTelemetry ?? true;
    const requireAudit = this.config.requireAuditLogging ?? false;
    const warnOnly = this.config.warnOnly ?? false;

    // No telemetry object at all
    if (!telemetry) {
      return this.result({
        passed: warnOnly || !requireTelemetry,
        action: warnOnly || !requireTelemetry ? 'WARN' : 'BLOCK',
        severity: warnOnly ? 'warning' : 'error',
        message: 'Telemetry context missing',
        metadata: { requireTelemetry },
      });
    }

    // Telemetry disabled
    if (telemetry.enabled === false) {
      return this.result({
        passed: false,
        action: 'BLOCK',
        severity: 'error',
        message: 'Telemetry explicitly disabled',
      });
    }

    // Audit logging required but missing
    if (requireAudit && telemetry.auditLogging !== true) {
      return this.result({
        passed: warnOnly,
        action: warnOnly ? 'WARN' : 'BLOCK',
        severity: warnOnly ? 'warning' : 'error',
        message: 'Audit logging is required but not enabled',
        metadata: { auditLogging: telemetry.auditLogging },
      });
    }

    // All checks passed
    return this.result({
      passed: true,
      action: 'ALLOW',
      severity: 'info',
      message: 'Telemetry enforcement passed',
      metadata: {
        destination: telemetry.destination,
      },
    });
  }
}
