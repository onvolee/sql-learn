import type { ExampleDef } from '../../../types.ts';
import { books } from '../schema.ts';

const example: ExampleDef = {
  id: 'fk-insert-ok',
  title: '合法外键 → 插入成功',
  support: 'full',
  display: {
    sql: `INSERT INTO books (id, title, author_id, published_year)
VALUES (9, 'Down and Out in Paris and London', 1, 1933)
ON CONFLICT (id) DO NOTHING
RETURNING id, title, author_id;`,
    drizzle: `import { books } from './schema';

await db
  .insert(books)
  .values({
    id: 9,
    title: 'Down and Out in Paris and London',
    authorId: 1,
    publishedYear: 1933,
  })
  .onConflictDoNothing()
  .returning({
    id: books.id,
    title: books.title,
    author_id: books.authorId,
  });`,
  },
  execute: (db) =>
    db
      .insert(books)
      .values({
        id: 9,
        title: 'Down and Out in Paris and London',
        authorId: 1,
        publishedYear: 1933,
      })
      .onConflictDoNothing()
      .returning({
        id: books.id,
        title: books.title,
        author_id: books.authorId,
      }),
};

export default example;
