import { describe, it, expect } from 'vitest';
import { DefamationGuardrail } from '@/lib/guardrails/content/defamation.guardrail';

describe('DefamationGuardrail', () => {
  it('allows neutral statements', () => {
    const g = new DefamationGuardrail();
    const res = g.execute('John works at a bank', {});
    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('blocks direct defamatory claims', () => {
    const g = new DefamationGuardrail();
    const res = g.execute('John is a criminal and committed fraud', {});
    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
    expect(res.severity).toBe('critical');
  });

  it('warns on allegations with qualifiers', () => {
    const g = new DefamationGuardrail();
    const res = g.execute('John allegedly committed fraud according to reports', {});

    expect(res.passed).toBe(true);
    expect(res.action).toBe('WARN');
  });

  it('blocks allegations when allowAllegations is false', () => {
    const g = new DefamationGuardrail({ allowAllegations: false });
    const res = g.execute('John allegedly committed fraud', {});

    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
  });

  it('respects custom wrongdoing terms', () => {
    const g = new DefamationGuardrail({
      wrongdoingTerms: ['insider trading'],
    });

    const res = g.execute('The CEO was involved in insider trading', {});

    expect(res.action).toBe('BLOCK');
  });
});
