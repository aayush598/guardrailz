import { describe, it, expect } from 'vitest';
import {
  CitationRequiredGuardrail,
  detectFactualClaims,
  extractCitations,
} from '@/lib/guardrails/output/citation-required.guardrail';

describe('CitationRequiredGuardrail', () => {
  it('allows output with no factual claims', () => {
    const g = new CitationRequiredGuardrail();
    const res = g.execute('Hello! How can I help you?', {});
    expect(res.action).toBe('ALLOW');
  });

  it('warns when factual claims lack citations', () => {
    const g = new CitationRequiredGuardrail();
    const res = g.execute('The capital of France is Paris.', {});
    expect(res.action).toBe('WARN');
    expect(res.passed).toBe(true);
  });

  it('blocks when requireCitations is enabled', () => {
    const g = new CitationRequiredGuardrail({
      requireCitations: true,
    });

    const res = g.execute('The capital of France is Paris.', {});
    expect(res.action).toBe('BLOCK');
    expect(res.passed).toBe(false);
  });

  it('allows factual claims with citations', () => {
    const g = new CitationRequiredGuardrail();
    const res = g.execute(
      'The capital of France is Paris. Source: https://en.wikipedia.org/wiki/Paris',
      {},
    );

    expect(res.action).toBe('ALLOW');
  });

  it('respects minCitations config', () => {
    const g = new CitationRequiredGuardrail({
      minCitations: 2,
    });

    const res = g.execute('Paris is the capital of France. [1]', {});

    expect(res.action).toBe('WARN');
  });
});

describe('citation detection helpers', () => {
  it('detects factual claims', () => {
    expect(detectFactualClaims('The capital of Germany is Berlin.')).toBe(true);
  });

  it('does not flag casual text', () => {
    expect(detectFactualClaims('I think Paris is beautiful.')).toBe(false);
  });

  it('extracts multiple citation formats', () => {
    const citations = extractCitations('Paris is the capital. [1] Source: https://example.com');

    expect(citations.length).toBeGreaterThanOrEqual(2);
  });
});
