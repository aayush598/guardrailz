import { pgTable, text, timestamp, integer, varchar, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';
import { apiKeys } from './api-keys';

export const rateLimitTracking = pgTable('rate_limit_tracking', {
  id: uuid('id').primaryKey().defaultRandom(),
  apiKeyId: uuid('api_key_id')
    .notNull()
    .references(() => apiKeys.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  requestCount: integer('request_count').default(0).notNull(),
  windowStart: timestamp('window_start').notNull(),
  windowType: varchar('window_type', { length: 10 }).notNull(),
});

export const userRateLimits = pgTable('user_rate_limits', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  requestsPerMinute: integer('requests_per_minute').default(500).notNull(),
  requestsPerDay: integer('requests_per_day').default(50000).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
