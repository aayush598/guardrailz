import { pgTable, text, timestamp, boolean, integer, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';

export const apiKeys = pgTable('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  key: text('key').notNull().unique(),
  name: text('name').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  requestsPerMinute: integer('requests_per_minute').default(100).notNull(),
  requestsPerDay: integer('requests_per_day').default(10000).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastUsedAt: timestamp('last_used_at'),
  expiresAt: timestamp('expires_at'),
});
