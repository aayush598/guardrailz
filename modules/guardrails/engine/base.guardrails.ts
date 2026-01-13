import { GuardrailContext } from './context';
import { GuardrailResult, GuardrailStage } from '@/modules/guardrails/engine/types';

export abstract class BaseGuardrail<Config = unknown> {
  readonly name: string;
  readonly stage: GuardrailStage;
  protected readonly config: Config;

  constructor(name: string, stage: GuardrailStage, config: Config) {
    this.name = name;
    this.stage = stage;
    this.config = config;
  }

  abstract execute(
    text: string,
    context: GuardrailContext,
  ): Promise<GuardrailResult> | GuardrailResult;

  protected result(partial: Omit<GuardrailResult, 'guardrailName'>): GuardrailResult {
    return {
      guardrailName: this.name,
      ...partial,
    };
  }
}
