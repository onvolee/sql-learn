import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'create-index-on-title',
  title: '给 title 显式建索引',
  support: 'partial',
  display: {
    sql: `CREATE INDEX IF NOT EXISTS books_title_idx ON books (title);

SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = current_schema()
  AND indexname  = 'books_title_idx';`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  CREATE INDEX IF NOT EXISTS books_title_idx ON books (title)
\`);

await db.execute(sql\`
  SELECT indexname, indexdef
  FROM pg_indexes
  WHERE schemaname = current_schema()
    AND indexname  = 'books_title_idx'
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`CREATE INDEX IF NOT EXISTS books_title_idx ON books (title)`);
    return db.execute(sql`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE schemaname = current_schema()
        AND indexname  = 'books_title_idx'
    `);
  },
};

export default example;
