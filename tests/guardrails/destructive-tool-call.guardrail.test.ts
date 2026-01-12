import { describe, it, expect } from 'vitest';
import { DestructiveToolCallGuardrail } from '@/lib/guardrails/tool/destructive-tool-call.guardrail';
import { createToolAccessContext } from '../fixtures/tool-context';

describe('DestructiveToolCallGuardrail', () => {
  it('allows when no tool context exists', () => {
    const g = new DestructiveToolCallGuardrail();
    const res = g.execute('', {});
    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('allows safe tool invocation', () => {
    const g = new DestructiveToolCallGuardrail();
    const ctx = {
      toolAccess: createToolAccessContext({
        toolName: 'db.read',
        toolArgs: { table: 'users' },
      }),
    };

    const res = g.execute('', ctx as any);
    expect(res.passed).toBe(true);
  });

  it('blocks destructive command', () => {
    const g = new DestructiveToolCallGuardrail();
    const ctx = {
      toolAccess: createToolAccessContext({
        toolName: 'shell.exec',
        toolArgs: { command: 'rm -rf /' },
      }),
    };

    const res = g.execute('', ctx as any);

    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
    expect(res.severity).toBe('critical');
    expect(res.metadata?.matchedPattern).toBeDefined();
  });

  it('warns instead of blocking when warnOnly is enabled', () => {
    const g = new DestructiveToolCallGuardrail({ warnOnly: true });
    const ctx = {
      toolAccess: createToolAccessContext({
        toolName: 'terraform.apply',
        toolArgs: { action: 'terraform destroy' },
      }),
    };

    const res = g.execute('', ctx as any);

    expect(res.passed).toBe(true);
    expect(res.action).toBe('WARN');
  });

  it('allows explicitly allowlisted destructive tool', () => {
    const g = new DestructiveToolCallGuardrail({
      allowlist: ['shell.exec'],
    });

    const ctx = {
      toolAccess: createToolAccessContext({
        toolName: 'shell.exec',
        toolArgs: { command: 'rm -rf /tmp' },
      }),
    };

    const res = g.execute('', ctx as any);

    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });
});
