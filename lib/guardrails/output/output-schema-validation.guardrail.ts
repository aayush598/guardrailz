import Ajv, { ErrorObject } from 'ajv';
import { BaseGuardrail } from '../core/base';
import { GuardrailContext } from '../core/context';
import { GuardrailAction, GuardrailSeverity } from '../core/types';

/* -------------------------------------------------------------------------- */
/* Config                                                                      */
/* -------------------------------------------------------------------------- */

export interface OutputSchemaValidationConfig {
  /**
   * JSON Schema to validate against
   */
  schema: Record<string, any>;

  /**
   * If true, invalid schema results in WARN instead of BLOCK
   * Default: false
   */
  warnOnly?: boolean;

  /**
   * If true, allow non-JSON output to pass
   * Default: false
   */
  allowNonJson?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Guardrail                                                                   */
/* -------------------------------------------------------------------------- */

export class OutputSchemaValidationGuardrail extends BaseGuardrail<OutputSchemaValidationConfig> {
  private ajv: Ajv;
  private validateFn: ReturnType<Ajv['compile']>;

  constructor(config: OutputSchemaValidationConfig) {
    super('OutputSchemaValidation', 'output', config);

    if (!config?.schema) {
      throw new Error('OutputSchemaValidationGuardrail requires a schema');
    }

    this.ajv = new Ajv({
      allErrors: true,
      strict: false,
    });

    this.validateFn = this.ajv.compile(config.schema);
  }

  execute(text: string, _context: GuardrailContext = {}) {
    if (typeof text !== 'string' || !text.trim()) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'Empty output',
      });
    }

    let parsed: any;

    try {
      parsed = JSON.parse(text);
    } catch {
      if (this.config.allowNonJson) {
        return this.result({
          passed: true,
          action: 'ALLOW',
          severity: 'info',
          message: 'Non-JSON output allowed',
        });
      }

      return this.fail('Output is not valid JSON', [
        {
          keyword: 'json',
          instancePath: '',
          schemaPath: '#/type',
          params: {},
          message: 'Invalid JSON',
        },
      ]);
    }

    const valid = this.validateFn(parsed);

    if (valid) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'Output matches schema',
      });
    }

    return this.fail('Output does not match required schema', this.validateFn.errors ?? []);
  }

  /* ------------------------------------------------------------------------ */
  /* Helpers                                                                  */
  /* ------------------------------------------------------------------------ */

  private fail(message: string, errors: ErrorObject[]) {
    const action: GuardrailAction = this.config.warnOnly ? 'WARN' : 'BLOCK';
    const severity: GuardrailSeverity = this.config.warnOnly ? 'warning' : 'error';

    return this.result({
      passed: false,
      action,
      severity,
      message,
      metadata: {
        schemaErrors: errors.map((e) => ({
          path: e.instancePath,
          keyword: e.keyword,
          message: e.message,
        })),
      },
    });
  }
}
