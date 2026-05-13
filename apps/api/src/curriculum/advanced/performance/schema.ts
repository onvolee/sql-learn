import {
  pgSchema,
  bigserial,
  serial,
  integer,
  text,
  numeric,
  timestamp,
} from 'drizzle-orm/pg-core';

export const m = pgSchema('m_performance');

export const customers = m.table('customers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  region: text('region').notNull(),
});

export const orders = m.table('orders', {
  id: bigserial('id', { mode: 'bigint' }).primaryKey(),
  customerId: integer('customer_id').notNull(),
  status: text('status').notNull(),
  total: numeric('total', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
