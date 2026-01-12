export interface Profile {
  id: string;
  userId: string;

  name: string;
  description?: string;

  isBuiltIn: boolean;

  inputGuardrails: unknown[];
  outputGuardrails: unknown[];
  toolGuardrails: unknown[];

  createdAt: Date;
  updatedAt: Date;
}
