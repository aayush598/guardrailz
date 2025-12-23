import { BaseGuardrail } from './base';

export type GuardrailFactory = (config?: any) => BaseGuardrail;

export class GuardrailRegistry {
  private readonly registry = new Map<string, GuardrailFactory>();

  register(name: string, factory: GuardrailFactory) {
    this.registry.set(name, factory);
  }

  create(name: string, config?: any): BaseGuardrail {
    const factory = this.registry.get(name);
    if (!factory) {
      throw new Error(`Guardrail "${name}" not registered`);
    }
    return factory(config);
  }

  has(name: string) {
    return this.registry.has(name);
  }
}

export const guardrailRegistry = new GuardrailRegistry();
