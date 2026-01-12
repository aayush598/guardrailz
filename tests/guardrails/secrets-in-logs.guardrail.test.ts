import { describe, it, expect } from 'vitest';
import { SecretsInLogsGuardrail } from '@/lib/guardrails/output/secrets-in-logs.guardrail';

describe('SecretsInLogsGuardrail', () => {
  it('allows logs without secrets', () => {
    const g = new SecretsInLogsGuardrail();

    const res = g.execute('User logged in successfully', {
      validationType: 'output',
    });

    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('blocks logs containing API keys', () => {
    const g = new SecretsInLogsGuardrail();

    const res = g.execute('Logging apiKey=sk_test_51H8...', { validationType: 'output' });

    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
    expect(res.severity).toBe('critical');
  });

  it('detects JWT tokens', () => {
    const g = new SecretsInLogsGuardrail();

    const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.abc.def';

    const res = g.execute(`Auth token: ${jwt}`, {
      validationType: 'output',
    });

    expect(res.passed).toBe(false);
    expect(res.metadata?.findings).toContain('JWT');
  });

  it('redacts secrets when configured', () => {
    const g = new SecretsInLogsGuardrail({ action: 'REDACT' });

    const res = g.execute('AWS key AKIA1234567890ABCDEF', { validationType: 'output' });

    expect(res.passed).toBe(true);
    expect(res.action).toBe('MODIFY');
    expect(res.redactedText).toContain('[REDACTED]');
  });

  it('ignores non-output validation types', () => {
    const g = new SecretsInLogsGuardrail();

    const res = g.execute('apiKey=should_not_block', { validationType: 'input' });

    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('detects high-entropy tokens', () => {
    const g = new SecretsInLogsGuardrail({
      enableGenericEntropyDetection: true,
    });

    const res = g.execute('token XyZkQ29tcGxleFNlY3JldFRva2VuMTIzNDU2', {
      validationType: 'output',
    });

    expect(res.passed).toBe(false);
    expect(res.metadata?.findings).toContain('High entropy token');
  });
});
