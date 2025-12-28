import "./index";
import { executeGuardrails } from "./core/executor";
import { GuardrailContext } from "./core/context";
import { getGuardrailInstances } from "./instance-cache";
import type { GuardrailDescriptor } from "./normalize";

export async function runGuardrails(
  profileId: string,
  descriptors: GuardrailDescriptor[],
  text: string,
  context: GuardrailContext
) {
  const instances = getGuardrailInstances(profileId, descriptors);
  return executeGuardrails(instances, text, context);
}
