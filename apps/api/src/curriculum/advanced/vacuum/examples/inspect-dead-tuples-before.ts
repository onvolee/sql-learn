import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'inspect-dead-tuples-before',
  title: '查 bloat_demo 的 live / dead tuple 数',
  support: 'partial',
  display: {
    sql: `SELECT relname,
       n_live_tup,
       n_dead_tup
FROM pg_stat_user_tables
WHERE schemaname = 'm_vacuum'
  AND relname = 'bloat_demo';`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT relname,
         n_live_tup,
         n_dead_tup
  FROM pg_stat_user_tables
  WHERE schemaname = 'm_vacuum'
    AND relname = 'bloat_demo'
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT relname,
             n_live_tup,
             n_dead_tup
      FROM pg_stat_user_tables
      WHERE schemaname = 'm_vacuum'
        AND relname = 'bloat_demo'
    `),
};

export default example;
