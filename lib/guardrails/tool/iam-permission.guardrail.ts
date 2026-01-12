import { BaseGuardrail } from '../core/base';
import { GuardrailContext } from '../core/context';
import { GuardrailResult } from '../core/types';

/* ============================================================================
 * IAM Permission Guardrail
 * Enforces least-privilege IAM permissions for tool invocations
 * ========================================================================== */

/* ---------------------------------------------------------------------------
 * Config
 * ------------------------------------------------------------------------- */
export interface IAMPermissionGuardrailConfig {
  /**
   * If true, allows wildcard permissions like "*"
   * Default: false (secure by default)
   */
  allowWildcards?: boolean;
}

/* ---------------------------------------------------------------------------
 * Context Shape (non-breaking, additive)
 * ------------------------------------------------------------------------- */
export interface IAMToolAccessContext {
  toolName: string;
  requiredPermissions: string[];
  grantedPermissions: string[];
}

/* ---------------------------------------------------------------------------
 * Guardrail
 * ------------------------------------------------------------------------- */
export class IAMPermissionGuardrail extends BaseGuardrail<IAMPermissionGuardrailConfig> {
  constructor(config: IAMPermissionGuardrailConfig = {}) {
    super('IAMPermission', 'tool', config);
  }

  execute(_: string, context: GuardrailContext): GuardrailResult {
    const toolAccess = (context as any)?.toolAccess as IAMToolAccessContext | undefined;

    /* ------------------------------------------------------------
     * No tool invocation → allow
     * ---------------------------------------------------------- */
    if (!toolAccess) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'No tool invocation detected',
      });
    }

    const { toolName, requiredPermissions = [], grantedPermissions = [] } = toolAccess;

    const hasWildcard = grantedPermissions.some((p) => p.trim() === '*');

    /* ------------------------------------------------------------
     * Wildcard permissions (blocked by default)
     * ---------------------------------------------------------- */
    if (hasWildcard && !this.config.allowWildcards) {
      return this.result({
        passed: false,
        action: 'BLOCK',
        severity: 'critical', // 🔧 FIX: must be critical
        message: 'Wildcard IAM permissions are not allowed',
        metadata: {
          toolName,
          grantedPermissions,
        },
      });
    }

    /* ------------------------------------------------------------
     * Wildcard explicitly allowed → full access
     * ---------------------------------------------------------- */
    if (hasWildcard && this.config.allowWildcards) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'warning', // allowed, but risky
        message: 'Wildcard IAM permission allowed by configuration',
        metadata: {
          toolName,
          grantedPermissions,
        },
      });
    }

    /* ------------------------------------------------------------
     * Missing permissions
     * ---------------------------------------------------------- */
    const missingPermissions = requiredPermissions.filter((p) => !grantedPermissions.includes(p));

    if (missingPermissions.length > 0) {
      return this.result({
        passed: false,
        action: 'BLOCK',
        severity: 'error',
        message: 'Insufficient IAM permissions',
        metadata: {
          toolName,
          requiredPermissions,
          grantedPermissions,
          missingPermissions,
        },
      });
    }

    /* ------------------------------------------------------------
     * Success
     * ---------------------------------------------------------- */
    return this.result({
      passed: true,
      action: 'ALLOW',
      severity: 'info',
      message: 'IAM permission check passed',
      metadata: {
        toolName,
        permissionsChecked: requiredPermissions.length,
      },
    });
  }
}
