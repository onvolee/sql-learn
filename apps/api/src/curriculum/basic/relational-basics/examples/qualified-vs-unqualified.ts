import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'qualified-vs-unqualified',
  title: '加 schema 前缀 vs 不加',
  support: 'partial',
  display: {
    sql: `SELECT 'unqualified' AS source, count(*) AS row_count FROM books
UNION ALL
SELECT 'qualified',                count(*)            FROM m_relational_basics.books;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT 'unqualified' AS source, count(*) AS row_count FROM books
  UNION ALL
  SELECT 'qualified',             count(*)             FROM m_relational_basics.books
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT 'unqualified' AS source, count(*) AS row_count FROM books
      UNION ALL
      SELECT 'qualified',             count(*)             FROM m_relational_basics.books
    `),
};

export default example;
