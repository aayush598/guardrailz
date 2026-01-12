import { describe, it, expect } from 'vitest';
import { IAMPermissionGuardrail } from '@/lib/guardrails/tool/iam-permission.guardrail';
import { createIAMToolContext } from '../fixtures/iam-context';

describe('IAMPermissionGuardrail', () => {
  it('allows when no tool context exists', () => {
    const g = new IAMPermissionGuardrail();
    const res = g.execute('', {});
    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('allows when permissions are sufficient', () => {
    const g = new IAMPermissionGuardrail();
    const res = g.execute('', {
      toolAccess: createIAMToolContext(),
    } as any);

    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('blocks when required permissions are missing', () => {
    const g = new IAMPermissionGuardrail();
    const res = g.execute('', {
      toolAccess: createIAMToolContext({
        grantedPermissions: [],
      }),
    } as any);

    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
    expect(res.metadata?.missingPermissions).toEqual(['s3:PutObject']);
  });

  it('blocks wildcard permissions by default', () => {
    const g = new IAMPermissionGuardrail();
    const res = g.execute('', {
      toolAccess: createIAMToolContext({
        grantedPermissions: ['*'],
      }),
    } as any);

    expect(res.passed).toBe(false);
    expect(res.severity).toBe('critical');
  });

  it('allows wildcard permissions when explicitly enabled', () => {
    const g = new IAMPermissionGuardrail({ allowWildcards: true });
    const res = g.execute('', {
      toolAccess: createIAMToolContext({
        grantedPermissions: ['*'],
      }),
    } as any);

    expect(res.passed).toBe(true);
  });
});
