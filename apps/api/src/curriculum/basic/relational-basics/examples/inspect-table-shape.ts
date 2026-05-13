import type { ExampleDef } from '../../../types.ts';
import { books } from '../schema.ts';

const example: ExampleDef = {
  id: 'inspect-table-shape',
  title: '看看 books 整张表',
  support: 'full',
  display: {
    sql: `SELECT * FROM books
ORDER BY id;`,
    drizzle: `import { books } from './schema';

await db
  .select()
  .from(books)
  .orderBy(books.id);`,
  },
  execute: (db) => db.select().from(books).orderBy(books.id),
};

export default example;
