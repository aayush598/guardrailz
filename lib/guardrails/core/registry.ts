import { BaseGuardrail } from './base';

type GuardrailFactory = (config?: any) => BaseGuardrail;

class GuardrailRegistry {
  private registry = new Map<string, GuardrailFactory>();

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
}

export const guardrailRegistry = new GuardrailRegistry();
