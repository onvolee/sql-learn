import {
  pgSchema,
  serial,
  text,
  integer,
  numeric,
  timestamp,
} from 'drizzle-orm/pg-core';

export const m = pgSchema('m_advanced_query');

export const customers = m.table('customers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  region: text('region').notNull(),
});

export const products = m.table('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
});

export const orders = m.table('orders', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id')
    .notNull()
    .references(() => customers.id),
  productId: integer('product_id')
    .notNull()
    .references(() => products.id),
  qty: integer('qty').notNull(),
  orderedAt: timestamp('ordered_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
