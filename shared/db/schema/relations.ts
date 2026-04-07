import { relations } from 'drizzle-orm';
import { users } from './users';
import { profiles } from './profiles';
import { apiKeys } from './api-keys';
import { guardrailExecutions } from './guardrail-executions';
import { orders } from './orders';

export const usersRelations = relations(users, ({ many }) => ({
  profiles: many(profiles),
  apiKeys: many(apiKeys),
  executions: many(guardrailExecutions),
  orders: many(orders),
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

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));
