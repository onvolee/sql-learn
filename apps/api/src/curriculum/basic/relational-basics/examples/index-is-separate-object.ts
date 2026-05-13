import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'index-is-separate-object',
  title: '删掉索引数据还在',
  support: 'partial',
  display: {
    sql: `DROP INDEX IF EXISTS books_title_idx;

SELECT count(*) AS row_count
FROM books;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`DROP INDEX IF EXISTS books_title_idx\`);

await db.execute(sql\`SELECT count(*) AS row_count FROM books\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`DROP INDEX IF EXISTS books_title_idx`);
    return db.execute(sql`SELECT count(*) AS row_count FROM books`);
  },
};

export default example;
