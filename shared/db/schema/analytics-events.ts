import { pgTable, uuid, text, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const analyticsEvents = pgTable('analytics_events', {
  eventId: uuid('event_id').primaryKey(),
  eventType: text('event_type').notNull(),

  userId: text('user_id').notNull(),
  apiKeyId: text('api_key_id'),
  profileId: text('profile_id'),

  payload: jsonb('payload').notNull(),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
});
