import { pgSchema, serial, text, integer } from 'drizzle-orm/pg-core';

export const m = pgSchema('m_relational_basics');

export const authors = m.table('authors', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  country: text('country'),
});

export const books = m.table('books', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  authorId: integer('author_id')
    .notNull()
    .references(() => authors.id),
  publishedYear: integer('published_year'),
});
