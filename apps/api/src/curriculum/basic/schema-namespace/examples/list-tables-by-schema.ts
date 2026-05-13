import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'list-tables-by-schema',
  title: '按 schema 列出表',
  support: 'partial',
  display: {
    sql: `SELECT schemaname, tablename
FROM pg_tables
WHERE schemaname IN ('m_schema_namespace', 'tmp_other')
ORDER BY schemaname, tablename;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT schemaname, tablename
  FROM pg_tables
  WHERE schemaname IN ('m_schema_namespace', 'tmp_other')
  ORDER BY schemaname, tablename
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT schemaname, tablename
      FROM pg_tables
      WHERE schemaname IN ('m_schema_namespace', 'tmp_other')
      ORDER BY schemaname, tablename
    `),
};

export default example;
