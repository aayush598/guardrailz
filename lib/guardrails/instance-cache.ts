import { guardrailRegistry } from "./core/registry";
import { BaseGuardrail } from "./core/base";
import type { GuardrailDescriptor } from "./normalize";

const cache = new Map<string, BaseGuardrail[]>();

export function getGuardrailInstances(
  profileId: string,
  descriptors: GuardrailDescriptor[]
): BaseGuardrail[] {
  const key = profileId;

  const cached = cache.get(key);
  if (cached) return cached;

  const instances = descriptors.map(d =>
    guardrailRegistry.create(d.name, d.config)
  );

  cache.set(key, instances);
  return instances;
}
