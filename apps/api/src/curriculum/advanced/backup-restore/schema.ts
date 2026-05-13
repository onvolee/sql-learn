import { pgSchema, serial, text, numeric } from 'drizzle-orm/pg-core';

export const m = pgSchema('m_backup_restore');

export const orders = m.table('orders', {
  id: serial('id').primaryKey(),
  customer: text('customer').notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
});
