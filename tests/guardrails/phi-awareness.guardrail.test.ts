import { describe, it, expect } from 'vitest';
import { PHIAwarenessGuardrail } from '@/lib/guardrails/input/phi-awareness.guardrail';

describe('PHIAwarenessGuardrail', () => {
  it('allows general medical discussion', () => {
    const g = new PHIAwarenessGuardrail();
    const res = g.execute('Diabetes is a chronic condition.', {});
    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('detects PHI and warns by default', () => {
    const g = new PHIAwarenessGuardrail();
    const res = g.execute(
      'Patient John was diagnosed with diabetes.',
      {}
    );

    expect(res.passed).toBe(true);
    expect(res.action).toBe('WARN');
    expect(res.severity).toBe('warning');
    expect(res.metadata?.phi).toBe(true);
  });

  it('blocks PHI when mode=block', () => {
    const g = new PHIAwarenessGuardrail({ mode: 'block' });
    const res = g.execute(
      'My name is Alice and I was diagnosed with cancer.',
      {}
    );

    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
    expect(res.severity).toBe('error');
  });

  it('allows medical text without identifiers when de-identified', () => {
    const g = new PHIAwarenessGuardrail({ allowDeidentified: true });
    const res = g.execute(
      'Treatment for asthma includes inhalers.',
      {}
    );

    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('does not trigger on non-medical identifiers', () => {
    const g = new PHIAwarenessGuardrail();
    const res = g.execute(
      'My email is test@example.com',
      {}
    );

    expect(res.passed).toBe(true);
    expect(res.metadata?.phi).toBe(false);
  });
});
