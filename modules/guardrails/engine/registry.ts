import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';

export type GuardrailFactory = (config?: unknown) => BaseGuardrail;

export class GuardrailRegistry {
  private readonly registry = new Map<string, GuardrailFactory>();

  register(name: string, factory: GuardrailFactory): void {
    if (this.registry.has(name)) {
      throw new Error(`Guardrail "${name}" already registered`);
    }
    this.registry.set(name, factory);
  }

  create(name: string, config?: unknown): BaseGuardrail {
    const factory = this.registry.get(name);

    if (!factory) {
      throw new Error(`Guardrail "${name}" not registered`);
    }

    return factory(config);
  }

  has(name: string): boolean {
    return this.registry.has(name);
  }

  list(): string[] {
    return Array.from(this.registry.keys());
  }
}

export const guardrailRegistry = new GuardrailRegistry();
