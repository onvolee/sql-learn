import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'pg-stat-statements-check',
  title: 'pg_stat_statements 装了没',
  support: 'partial',
  display: {
    sql: `SELECT extname
FROM pg_extension
WHERE extname = 'pg_stat_statements';`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT extname
  FROM pg_extension
  WHERE extname = 'pg_stat_statements'
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT extname
      FROM pg_extension
      WHERE extname = 'pg_stat_statements'
    `),
};

export default example;
