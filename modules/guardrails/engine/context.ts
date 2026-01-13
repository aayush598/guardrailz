export interface IAMToolAccessContext {
  toolName: string;
  requiredPermissions: string[];
  grantedPermissions: string[];
}

/* -------------------------------------------------------------------------- */
/* Security Signals                                                            */
/* -------------------------------------------------------------------------- */

export interface SecuritySignals {
  apiKeyLeak?: boolean;
  unusualGeoAccess?: boolean;
  excessiveFailures?: boolean;
  compromisedBy?: string[];
}

/* -------------------------------------------------------------------------- */
/* Shared sub-contexts                                                         */
/* -------------------------------------------------------------------------- */

export interface TelemetryContext {
  enabled?: boolean;
  auditLogging?: boolean;
  destination?: string;
}

export interface UsageContext {
  estimatedCostUsd?: number;
  dailyCostUsd?: number;
  monthlyCostUsd?: number;
}

export interface ModelContext {
  model?: string;
}

export interface RetentionContext {
  createdAt: string | Date;
  retentionDays: number;
  policyId?: string;
  legalHold?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Guardrail Context                                                           */
/* -------------------------------------------------------------------------- */

export interface GuardrailContext {
  /* Request identity */
  validationType?: 'input' | 'output';
  userId?: string;
  apiKeyId?: string;
  profileId?: string;

  /** Client IP address (if available) */
  ip?: string;

  /* Behavioral / risk signals */
  ageVerified?: boolean;
  priorViolations?: number;

  /* Tool execution */
  toolName?: string;
  toolArgs?: Record<string, unknown>;

  /* Tool execution (structured, optional) */
  toolAccess?: IAMToolAccessContext;

  /* Operational / policy context */
  model?: string;
  telemetry?: TelemetryContext;
  usage?: UsageContext;
  retention?: RetentionContext;

  /* Security */
  securitySignals?: SecuritySignals;
}
