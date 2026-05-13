import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'equiv-of-di',
  title: '\\di 的等价 SQL — 列出当前 schema 的索引',
  support: 'partial',
  display: {
    sql: `SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = current_schema()
ORDER BY indexname;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT indexname, indexdef
  FROM pg_indexes
  WHERE schemaname = current_schema()
  ORDER BY indexname
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE schemaname = current_schema()
      ORDER BY indexname
    `),
};

export default example;
