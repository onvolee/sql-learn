import { pgSchema, serial, text } from 'drizzle-orm/pg-core';

export const m = pgSchema('m_schema_namespace');

export const t1 = m.table('t1', {
  id: serial('id').primaryKey(),
  val: text('val').notNull(),
});
