import { pgSchema, serial, text, jsonb } from 'drizzle-orm/pg-core';

export const m = pgSchema('m_jsonb');

export const docs = m.table('docs', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  body: jsonb('body').notNull(),
});
