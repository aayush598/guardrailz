import { relations } from 'drizzle-orm';
import { users } from './users';
import { profiles } from './profiles';
import { apiKeys } from './api-keys';
import { guardrailExecutions } from './guardrail-executions';

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
