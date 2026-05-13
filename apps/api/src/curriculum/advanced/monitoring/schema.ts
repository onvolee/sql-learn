import { pgSchema, serial, text } from 'drizzle-orm/pg-core';

export const m = pgSchema('m_monitoring');

export const probe = m.table('probe', {
  id: serial('id').primaryKey(),
  val: text('val').notNull(),
});
