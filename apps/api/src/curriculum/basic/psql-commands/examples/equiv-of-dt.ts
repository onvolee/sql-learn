import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'equiv-of-dt',
  title: '\\dt 的等价 SQL — 列出当前 schema 的表',
  support: 'partial',
  display: {
    sql: `SELECT tablename
FROM pg_tables
WHERE schemaname = current_schema()
ORDER BY tablename;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT tablename
  FROM pg_tables
  WHERE schemaname = current_schema()
  ORDER BY tablename
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = current_schema()
      ORDER BY tablename
    `),
};

export default example;
