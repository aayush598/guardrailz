import { describe, it, expect } from 'vitest';
import { ApiKeyRotationTriggerGuardrail } from '@/lib/guardrails/security/api-key-rotation.guardrail';

describe('ApiKeyRotationTriggerGuardrail', () => {
  it('allows when no security signals are present', () => {
    const g = new ApiKeyRotationTriggerGuardrail();

    const res = g.execute('', {
      apiKeyId: 'key-1',
      userId: 'u1',
    });

    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('warns when a single compromise signal is detected', () => {
    const g = new ApiKeyRotationTriggerGuardrail();

    const res = g.execute('', {
      apiKeyId: 'key-1',
      securitySignals: {
        apiKeyLeak: true,
      },
    } as any);

    expect(res.passed).toBe(true);
    expect(res.action).toBe('WARN');
    expect(res.severity).toBe('critical');
    expect(res.metadata?.rotationRequired).toBe(true);
  });

  it('blocks when blockOnTrigger is enabled', () => {
    const g = new ApiKeyRotationTriggerGuardrail({
      blockOnTrigger: true,
    });

    const res = g.execute('', {
      apiKeyId: 'key-1',
      securitySignals: {
        apiKeyLeak: true,
      },
    } as any);

    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
  });

  it('requires multiple signals when threshold > 1', () => {
    const g = new ApiKeyRotationTriggerGuardrail({
      signalThreshold: 2,
    });

    const res = g.execute('', {
      securitySignals: {
        apiKeyLeak: true,
      },
    } as any);

    expect(res.action).toBe('ALLOW');
  });

  it('triggers when threshold is met', () => {
    const g = new ApiKeyRotationTriggerGuardrail({
      signalThreshold: 2,
    });

    const res = g.execute('', {
      apiKeyId: 'key-1',
      securitySignals: {
        apiKeyLeak: true,
        unusualGeoAccess: true,
      },
    } as any);

    expect(res.action).toBe('WARN');
    expect(res.metadata?.signals.length).toBe(2);
  });
});
