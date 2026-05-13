import { pgSchema, serial, text, boolean } from 'drizzle-orm/pg-core';

export const m = pgSchema('m_permission');

export const reports = m.table('reports', {
  id: serial('id').primaryKey(),
  owner: text('owner').notNull(),
  content: text('content').notNull(),
  sensitive: boolean('sensitive').notNull().default(false),
});
