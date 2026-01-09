import { describe, it, expect } from 'vitest';
import { EncodingObfuscationGuardrail } from '@/lib/guardrails/input/encoding-obfuscation.guardrail';

describe('EncodingObfuscationGuardrail', () => {
  it('allows clean input', () => {
    const g = new EncodingObfuscationGuardrail();
    const res = g.execute('hello world', {});
    expect(res.action).toBe('ALLOW');
    expect(res.passed).toBe(true);
  });

//   it('detects base64 encoded content', () => {
//     const g = new EncodingObfuscationGuardrail();
//     const res = g.execute('cGFzc3dvcmQ=', {}); // password
//     expect(res.action).toBe('BLOCK');
//     expect(res.metadata?.signals).toContain('base64_decoded');
//   });

  it('detects leetspeak secrets', () => {
    const g = new EncodingObfuscationGuardrail();
    const res = g.execute('p@$$w0rd', {});
    expect(res.action).toBe('BLOCK');
    expect(res.metadata?.signals).toContain('leet_or_homoglyph');
  });

  it('warns on weak obfuscation', () => {
    const g = new EncodingObfuscationGuardrail({
      confidenceThreshold: 1.2,
    });

    const res = g.execute('p@ssword', {});
    expect(res.action).toBe('WARN');
    expect(res.passed).toBe(true);
  });

  it('respects blockOnDecode = false', () => {
    const g = new EncodingObfuscationGuardrail({
      blockOnDecode: false,
    });

    const res = g.execute('c2VjcmV0', {}); // secret
    expect(res.action).toBe('WARN');
    expect(res.passed).toBe(true);
  });
});
