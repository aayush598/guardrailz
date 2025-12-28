import { GuardrailDescriptor } from "../guardrails/normalize";

export interface RuntimeProfile {
  id: string;
  name: string;

  // precomputed
  input: GuardrailDescriptor[];
  output: GuardrailDescriptor[];
  both: GuardrailDescriptor[];
}
