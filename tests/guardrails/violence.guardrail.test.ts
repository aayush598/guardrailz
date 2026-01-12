import { describe, it, expect } from 'vitest';
import { ViolenceGuardrail } from '@/lib/guardrails/content/violence.guardrail';

describe('ViolenceGuardrail', () => {
  it('allows safe content', () => {
    const g = new ViolenceGuardrail();
    const res = g.execute('Hello world', {});
    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('warns on non-graphic violence', () => {
    const g = new ViolenceGuardrail();
    const res = g.execute('He threatened to kill them', {});
    expect(res.passed).toBe(true);
    expect(res.action).toBe('WARN');
    expect(res.severity).toBe('warning');
  });

  it('blocks graphic violence', () => {
    const g = new ViolenceGuardrail();
    const res = g.execute('Blood splattered everywhere after he was stabbed', {});
    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
    expect(res.severity).toBe('error');
  });

  it('blocks extreme violence with critical severity', () => {
    const g = new ViolenceGuardrail();
    const res = g.execute('He was dismembered and his organs were exposed', {});
    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
    expect(res.severity).toBe('critical');
  });

  it('can allow non-graphic violence if configured', () => {
    const g = new ViolenceGuardrail({ warnOnNonGraphic: false });
    const res = g.execute('The war lasted many years', {});
    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });
});
