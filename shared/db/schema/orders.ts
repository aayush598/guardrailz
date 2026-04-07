import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { users } from './users';

export const orders = pgTable('orders', {
  id: text('id').primaryKey(), // We can use nanoId or UUID here, we'll assign it from codebase
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  razorpayOrderId: text('razorpay_order_id').notNull(),
  razorpayPaymentId: text('razorpay_payment_id'),
  razorpaySignature: text('razorpay_signature'),
  plan: text('plan').notNull(),
  amount: integer('amount').notNull(),
  status: text('status').default('created').notNull(), // created, paid, failed
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
