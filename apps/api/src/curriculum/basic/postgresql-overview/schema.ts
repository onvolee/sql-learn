import { pgSchema, serial, text, jsonb } from 'drizzle-orm/pg-core';

export const m = pgSchema('m_postgresql_overview');

export const items = m.table('items', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  tags: text('tags').array(),
  data: jsonb('data'),
});
