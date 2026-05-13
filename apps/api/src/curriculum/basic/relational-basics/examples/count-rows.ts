import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { books } from '../schema.ts';

const example: ExampleDef = {
  id: 'count-rows',
  title: '数一下 books 有几行',
  support: 'full',
  display: {
    sql: `SELECT count(*) AS row_count
FROM books;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { books } from './schema';

await db
  .select({ row_count: sql\`count(*)\`.as('row_count') })
  .from(books);`,
  },
  execute: (db) =>
    db
      .select({ row_count: sql<number>`count(*)`.as('row_count') })
      .from(books),
};

export default example;
