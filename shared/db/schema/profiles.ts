import { pgTable, text, timestamp, jsonb, boolean, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  isBuiltIn: boolean('is_built_in').default(false).notNull(),
  inputGuardrails: jsonb('input_guardrails').notNull().$type<any[]>(),
  outputGuardrails: jsonb('output_guardrails').notNull().$type<any[]>(),
  toolGuardrails: jsonb('tool_guardrails').notNull().$type<any[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
