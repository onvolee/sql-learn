import { pgSchema, serial, text, numeric, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const m = pgSchema('m_transaction');

export const accounts = m.table(
  'accounts',
  {
    id: serial('id').primaryKey(),
    owner: text('owner').notNull(),
    balance: numeric('balance', { precision: 10, scale: 2 })
      .notNull()
      .default('0'),
  },
  (t) => ({
    balanceNonNegative: check('balance_non_negative', sql`${t.balance} >= 0`),
  }),
);
