import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'equiv-of-d-table',
  title: '\\d books 的等价 SQL — 看一张表的列结构',
  support: 'partial',
  display: {
    sql: `SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = current_schema()
  AND table_name   = 'books'
ORDER BY ordinal_position;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT column_name, data_type, is_nullable
  FROM information_schema.columns
  WHERE table_schema = current_schema()
    AND table_name   = 'books'
  ORDER BY ordinal_position
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = current_schema()
        AND table_name   = 'books'
      ORDER BY ordinal_position
    `),
};

export default example;
