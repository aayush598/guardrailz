import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';
import { GuardrailContext } from '../../engine/context';

export interface RetentionCheckConfig {
  /**
   * If true, expired data will BLOCK instead of WARN
   * Default: true
   */
  blockOnExpiry?: boolean;

  /**
   * Allow processing if legal hold is active
   * Default: true
   */
  allowLegalHold?: boolean;

  /**
   * Clock skew tolerance in milliseconds
   * Default: 5 minutes
   */
  clockSkewMs?: number;
}

export class RetentionCheckGuardrail extends BaseGuardrail<RetentionCheckConfig> {
  constructor(config: unknown = {}) {
    const resolved = (config ?? {}) as RetentionCheckConfig;
    super('RetentionCheck', 'general', resolved);
  }

  execute(_text: string, context: GuardrailContext) {
    const retention = context.retention;

    // No retention metadata → pass silently
    if (!retention) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'No retention metadata provided',
      });
    }

    const { createdAt, retentionDays, policyId, legalHold } = retention;

    // Legal hold bypass
    if (legalHold && this.config.allowLegalHold !== false) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'Legal hold active; retention enforcement bypassed',
        metadata: { policyId },
      });
    }

    const created = new Date(createdAt).getTime();
    if (Number.isNaN(created)) {
      return this.result({
        passed: false,
        action: 'BLOCK',
        severity: 'error',
        message: 'Invalid retention createdAt timestamp',
        metadata: { policyId },
      });
    }

    const retentionMs = retentionDays * 24 * 60 * 60 * 1000;
    const skew = this.config.clockSkewMs ?? 5 * 60 * 1000;
    const expiresAt = created + retentionMs + skew;
    const now = Date.now();

    // Still valid
    if (now <= expiresAt) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'Retention policy valid',
        metadata: {
          policyId,
          expiresAt: new Date(expiresAt).toISOString(),
        },
      });
    }

    // Expired
    const block = this.config.blockOnExpiry !== false;

    return this.result({
      passed: false,
      action: block ? 'BLOCK' : 'WARN',
      severity: block ? 'error' : 'warning',
      message: 'Data retention period has expired',
      metadata: {
        policyId,
        expiredAt: new Date(expiresAt).toISOString(),
        retentionDays,
      },
    });
  }
}
