import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import * as schema from './schema';

export type User = InferSelectModel<typeof schema.users>;
export type NewUser = InferInsertModel<typeof schema.users>;

export type Profile = InferSelectModel<typeof schema.profiles>;
export type ApiKey = InferSelectModel<typeof schema.apiKeys>;

export type GuardrailExecution = InferSelectModel<typeof schema.guardrailExecutions>;
