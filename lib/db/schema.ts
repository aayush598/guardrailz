import { pgTable, text, timestamp, jsonb, integer, boolean, varchar, uuid, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table (synced with Clerk)
export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk user ID
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Profiles table (built-in + custom)
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

// API Keys table
export const apiKeys = pgTable('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  key: text('key').notNull().unique(),
  name: text('name').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  // Rate limiting
  requestsPerMinute: integer('requests_per_minute').default(100).notNull(),
  requestsPerDay: integer('requests_per_day').default(10000).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastUsedAt: timestamp('last_used_at'),
  expiresAt: timestamp('expires_at'),
});

// Guardrail Executions (logs)
export const guardrailExecutions = pgTable(
  'guardrail_executions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    apiKeyId: uuid('api_key_id').references(() => apiKeys.id, { onDelete: 'set null' }),
    profileId: uuid('profile_id').references(() => profiles.id),
    inputText: text('input_text'),
    outputText: text('output_text'),
    guardrailResults: jsonb('guardrail_results').notNull().$type<any[]>(),
    passed: boolean('passed').notNull(),
    executionTimeMs: integer('execution_time_ms'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userCreatedIdx: index('idx_exec_user_created')
      .on(table.userId, table.createdAt),

    userPassedIdx: index('idx_exec_user_passed')
      .on(table.userId, table.passed),

    userProfileIdx: index('idx_exec_user_profile')
      .on(table.userId, table.profileId),
  })
);


// Rate Limit Tracking
export const rateLimitTracking = pgTable('rate_limit_tracking', {
  id: uuid('id').primaryKey().defaultRandom(),
  apiKeyId: uuid('api_key_id').notNull().references(() => apiKeys.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  requestCount: integer('request_count').default(0).notNull(),
  windowStart: timestamp('window_start').notNull(),
  windowType: varchar('window_type', { length: 10 }).notNull(), // 'minute' or 'day'
});

// User Account Rate Limits
export const userRateLimits = pgTable('user_rate_limits', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  requestsPerMinute: integer('requests_per_minute').default(500).notNull(),
  requestsPerDay: integer('requests_per_day').default(50000).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  profiles: many(profiles),
  apiKeys: many(apiKeys),
  executions: many(guardrailExecutions),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  user: one(users, {
    fields: [apiKeys.userId],
    references: [users.id],
  }),
}));