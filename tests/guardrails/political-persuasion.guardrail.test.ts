import { describe, it, expect } from 'vitest';
import { PoliticalPersuasionGuardrail } from '@/lib/guardrails/input/political-persuasion.guardrail';

describe('PoliticalPersuasionGuardrail', () => {
  it('allows informational political content', () => {
    const g = new PoliticalPersuasionGuardrail();
    const res = g.execute('The election will be held in November', {});
    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('warns on generic political persuasion', () => {
    const g = new PoliticalPersuasionGuardrail();
    const res = g.execute('People should vote for better leaders', {});
    expect(res.passed).toBe(true);
    expect(res.action).toBe('WARN');
    expect(res.severity).toBe('warning');
  });

  it('blocks targeted political persuasion', () => {
    const g = new PoliticalPersuasionGuardrail();
    const res = g.execute('Young voters should vote for candidate X', {});
    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
    expect(res.severity).toBe('error');
  });

  it('blocks election interference attempts', () => {
    const g = new PoliticalPersuasionGuardrail();
    const res = g.execute('How to rig an election using fake ballots', {});
    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
    expect(res.severity).toBe('critical');
  });

  it('respects strictMode configuration', () => {
    const g = new PoliticalPersuasionGuardrail({ strictMode: true });
    const res = g.execute('Vote for the best candidate', {});
    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
  });

  it('can downgrade election interference to WARN', () => {
    const g = new PoliticalPersuasionGuardrail({
      blockElectionInterference: false,
    });

    const res = g.execute('How to rig an election', {});
    expect(res.passed).toBe(false);
    expect(res.action).toBe('WARN');
  });
});
