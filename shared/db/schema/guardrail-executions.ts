import {
  pgTable,
  text,
  timestamp,
  jsonb,
  boolean,
  integer,
  uuid,
  index,
} from 'drizzle-orm/pg-core';
import { users } from './users';
import { apiKeys } from './api-keys';
import { profiles } from './profiles';

export const guardrailExecutions = pgTable(
  'guardrail_executions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    apiKeyId: uuid('api_key_id').references(() => apiKeys.id, {
      onDelete: 'set null',
    }),
    profileId: uuid('profile_id').references(() => profiles.id),
    inputText: text('input_text'),
    outputText: text('output_text'),
    guardrailResults: jsonb('guardrail_results').notNull().$type<any[]>(),
    passed: boolean('passed').notNull(),
    executionTimeMs: integer('execution_time_ms'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    byUserCreated: index('idx_exec_user_created').on(t.userId, t.createdAt),
    byUserPassed: index('idx_exec_user_passed').on(t.userId, t.passed),
    byUserProfile: index('idx_exec_user_profile').on(t.userId, t.profileId),
  }),
);
