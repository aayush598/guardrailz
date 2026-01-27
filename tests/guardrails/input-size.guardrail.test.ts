import { describe, it, expect } from 'vitest';
import { InputSizeGuardrail } from '@/modules/guardrails/guards/input/input-size.guardrail';
import { GuardrailContext } from '@/modules/guardrails/engine/context';

describe('InputSizeGuardrail', () => {
  it('allows small input', () => {
    const g = new InputSizeGuardrail({ maxChars: 100 });

    const res = g.execute('Hello world', {});

    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('warns when approaching soft limit', () => {
    const g = new InputSizeGuardrail({
      maxChars: 100,
      warnThresholdRatio: 0.8,
    });

    const text = 'a'.repeat(85);
    const res = g.execute(text, {});

    expect(res.passed).toBe(true);
    expect(res.action).toBe('WARN');
    expect(res.severity).toBe('warning');
  });

  it('blocks when exceeding hard character limit', () => {
    const g = new InputSizeGuardrail({ maxChars: 50 });

    const text = 'a'.repeat(60);
    const res = g.execute(text, {});

    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
    expect(res.severity).toBe('critical');
  });

  it('blocks when exceeding byte limit', () => {
    const g = new InputSizeGuardrail({ maxBytes: 10 });

    const text = '😀😀😀😀'; // multi-byte characters
    const res = g.execute(text, {});

    expect(res.action).toBe('BLOCK');
  });

  it('truncates input on soft limit when enabled', () => {
    const g = new InputSizeGuardrail({
      maxChars: 100,
      warnThresholdRatio: 0.8,
      truncateOnSoftLimit: true,
      truncateToChars: 50,
    });

    const text = 'a'.repeat(90);
    const res = g.execute(text, {});

    expect(res.passed).toBe(true);
    expect(res.action).toBe('MODIFY');
    expect(res.redactedText?.length).toBe(50);
  });

  it('signals abuse on repeated hard limit violations', () => {
    const g = new InputSizeGuardrail({ maxChars: 10 });

    const context: GuardrailContext = {};
    const text = 'a'.repeat(50);

    const res = g.execute(text, context);

    expect(res.action).toBe('BLOCK');
    expect(context.securitySignals?.excessiveFailures).toBe(true);
  });
});
