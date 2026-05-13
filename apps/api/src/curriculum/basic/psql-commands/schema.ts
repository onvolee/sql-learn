import { pgSchema, serial, text } from 'drizzle-orm/pg-core';

export const m = pgSchema('m_psql_commands');

export const books = m.table('books', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  author: text('author'),
});
