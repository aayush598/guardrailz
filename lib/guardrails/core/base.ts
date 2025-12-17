import { GuardrailContext } from './context';
import { GuardrailResult, GuardrailSeverity, GuardrailAction } from './types';

export abstract class BaseGuardrail<Config = any> {
  readonly name: string;
  readonly stage: GuardrailStage;
  protected config: Config;

  constructor(name: string, stage: GuardrailStage, config: Config) {
    this.name = name;
    this.stage = stage;
    this.config = config;
  }

  abstract execute(
    text: string,
    context: GuardrailContext
  ): Promise<GuardrailResult> | GuardrailResult;

  protected result(
    partial: Omit<GuardrailResult, 'guardrailName'>
  ): GuardrailResult {
    return {
      guardrailName: this.name,
      ...partial,
    };
  }
}
