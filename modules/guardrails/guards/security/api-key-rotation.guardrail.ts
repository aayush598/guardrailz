import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';
import { GuardrailContext } from '../../engine/context';

export interface ApiKeyRotationConfig {
  /** Minimum signals required to trigger rotation */
  signalThreshold?: number;

  /** If true, block requests until rotation is complete */
  blockOnTrigger?: boolean;

  /** Enable audit metadata */
  enableTelemetry?: boolean;
}

export class ApiKeyRotationTriggerGuardrail extends BaseGuardrail<ApiKeyRotationConfig> {
  constructor(config?: unknown) {
    const resolved: ApiKeyRotationConfig = {
      signalThreshold: 1,
      blockOnTrigger: false,
      enableTelemetry: true,
      ...((config as ApiKeyRotationConfig) ?? {}),
    };

    super('ApiKeyRotationTrigger', 'general', resolved);
  }

  execute(_: string, context: GuardrailContext) {
    const signals = this.extractSignals(context);

    if (signals.length < (this.config.signalThreshold ?? 1)) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'No API key compromise detected',
      });
    }

    const shouldBlock = this.config.blockOnTrigger === true;

    return this.result({
      passed: !shouldBlock,
      action: shouldBlock ? 'BLOCK' : 'WARN',
      severity: 'critical',
      message: 'Suspected API key compromise detected. Rotation required.',
      metadata: {
        rotationRequired: true,
        signals,
        apiKeyId: context.apiKeyId,
        userId: context.userId,
        telemetry: this.config.enableTelemetry
          ? {
              detectedAt: new Date().toISOString(),
              signalCount: signals.length,
            }
          : undefined,
      },
    });
  }

  private extractSignals(context: GuardrailContext): string[] {
    const sec = context.securitySignals;
    if (!sec) return [];

    const signals: string[] = [];

    if (sec.apiKeyLeak) signals.push('api_key_leak');
    if (sec.unusualGeoAccess) signals.push('unusual_geo_access');
    if (sec.excessiveFailures) signals.push('excessive_auth_failures');

    if (Array.isArray(sec.compromisedBy)) {
      signals.push(...sec.compromisedBy.map((s: string) => `external:${s}`));
    }

    return signals;
  }
}
