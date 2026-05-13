import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'equiv-of-l',
  title: '\\l 的等价 SQL — 列出所有数据库',
  support: 'partial',
  display: {
    sql: `SELECT datname
FROM pg_database
ORDER BY datname;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT datname
  FROM pg_database
  ORDER BY datname
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT datname
      FROM pg_database
      ORDER BY datname
    `),
};

export default example;
