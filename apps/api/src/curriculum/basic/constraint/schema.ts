import {
  pgSchema,
  serial,
  text,
  integer,
  numeric,
  primaryKey,
  check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const m = pgSchema('m_constraint');

export const orders = m.table(
  'orders',
  {
    id: serial('id').primaryKey(),
    customer: text('customer').notNull(),
    status: text('status').notNull().default('pending'),
    total: numeric('total', { precision: 10, scale: 2 }),
  },
  (t) => ({
    totalNonNegative: check('orders_total_non_negative', sql`${t.total} >= 0`),
  }),
);

export const orderItems = m.table(
  'order_items',
  {
    orderId: integer('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    lineNo: integer('line_no').notNull(),
    product: text('product').notNull(),
    qty: integer('qty').notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.orderId, t.lineNo] }),
    qtyPositive: check('order_items_qty_positive', sql`${t.qty} > 0`),
  }),
);
