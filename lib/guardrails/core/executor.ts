import { guardrailRegistry } from "./registry";
import {normalizeGuardrailName} from './../index'
export async function executeGuardrails(
  guardrails: Array<{ name?: string; class?: string; config?: any }>,
  text: string,
  context?: any
) {
  const start = Date.now();

  const results = await Promise.all(
    guardrails.map(async (g) => {
      const guardrailName = g.name ?? g.class;

      if (!guardrailName) {
        return {
          passed: false,
          guardrailName: 'UnknownGuardrail',
          severity: 'error',
          action: 'BLOCK',
          message: 'Guardrail entry missing name/class',
        };
      }

      try {
        const guardrail = guardrailRegistry.create(
          normalizeGuardrailName(guardrailName),
          g.config
        );

        return await guardrail.execute(text, context ?? {});
      } catch (e: any) {
        return {
          passed: false,
          guardrailName,
          severity: 'error',
          action: 'BLOCK',
          message: e.message ?? 'Guardrail execution failed',
        };
      }
    })
  );

  return {
    passed: results.every(r => r.passed),
    results,
    executionTimeMs: Date.now() - start,
    summary: {
      total: results.length,
      passed: results.filter(r => r.passed).length,
      failed: results.filter(r => !r.passed).length,
    },
  };
}
