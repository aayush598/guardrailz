import { guardrailRegistry } from "./registry";
import type { GuardrailResult } from "./types";
import type { GuardrailContext } from './context';
import { BaseGuardrail } from "./base";

export async function executeGuardrails(
  guardrails: BaseGuardrail[],
  text: string,
  context: GuardrailContext = {}
) {
  const start = Date.now();

  const results: GuardrailResult[] = [];

  for (const guardrail of guardrails) {
    try {
      const result = await guardrail.execute(text, context);
      results.push(result);

      // Optional short-circuit on BLOCK
      if (result.action === 'BLOCK') {
        break;
      }
    } catch (err: any) {
      results.push({
        passed: false,
        guardrailName: guardrail.name,
        severity: 'error',
        action: 'BLOCK',
        message: err?.message ?? 'Guardrail execution failed',
      });
      break;
    }
  }
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
