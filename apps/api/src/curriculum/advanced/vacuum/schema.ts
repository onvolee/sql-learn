import { pgSchema, serial, text } from 'drizzle-orm/pg-core';

export const m = pgSchema('m_vacuum');

export const bloatDemo = m.table('bloat_demo', {
  id: serial('id').primaryKey(),
  payload: text('payload').notNull(),
});
