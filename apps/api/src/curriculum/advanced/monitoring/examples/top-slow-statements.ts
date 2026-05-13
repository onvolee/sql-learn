import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'top-slow-statements',
  title: '平均最慢的 5 条语句（未装扩展会报 42P01）',
  support: 'partial',
  display: {
    sql: `SELECT query,
       calls,
       mean_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 5;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT query,
         calls,
         mean_exec_time
  FROM pg_stat_statements
  ORDER BY mean_exec_time DESC
  LIMIT 5
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT query,
             calls,
             mean_exec_time
      FROM pg_stat_statements
      ORDER BY mean_exec_time DESC
      LIMIT 5
    `),
};

export default example;
