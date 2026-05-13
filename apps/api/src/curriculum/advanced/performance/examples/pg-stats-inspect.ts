import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'pg-stats-inspect',
  title: 'pg_stats — 看 planner 用的统计',
  support: 'partial',
  display: {
    sql: `SELECT attname,
       n_distinct,
       null_frac,
       most_common_vals
FROM pg_stats
WHERE schemaname = 'm_performance'
  AND tablename  = 'orders'
ORDER BY attname;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT attname,
         n_distinct,
         null_frac,
         most_common_vals
  FROM pg_stats
  WHERE schemaname = 'm_performance'
    AND tablename  = 'orders'
  ORDER BY attname
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT attname,
             n_distinct,
             null_frac,
             most_common_vals
      FROM pg_stats
      WHERE schemaname = 'm_performance'
        AND tablename  = 'orders'
      ORDER BY attname
    `),
};

export default example;
