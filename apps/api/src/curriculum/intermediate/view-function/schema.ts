import {
  pgSchema,
  serial,
  text,
  numeric,
  timestamp,
} from 'drizzle-orm/pg-core';

export const m = pgSchema('m_view_function');

export const sales = m.table('sales', {
  id: serial('id').primaryKey(),
  product: text('product').notNull(),
  region: text('region').notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  soldAt: timestamp('sold_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
