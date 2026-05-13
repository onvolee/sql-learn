import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'inspect-default-index',
  title: '主键自带的索引',
  support: 'partial',
  display: {
    sql: `SELECT tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = current_schema()
ORDER BY tablename, indexname;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT tablename, indexname, indexdef
  FROM pg_indexes
  WHERE schemaname = current_schema()
  ORDER BY tablename, indexname
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT tablename, indexname, indexdef
      FROM pg_indexes
      WHERE schemaname = current_schema()
      ORDER BY tablename, indexname
    `),
};

export default example;
