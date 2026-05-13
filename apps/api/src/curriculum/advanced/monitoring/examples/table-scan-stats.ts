import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'table-scan-stats',
  title: '本 schema 表的顺序扫 / 索引扫次数',
  support: 'partial',
  display: {
    sql: `SELECT relname,
       seq_scan,
       idx_scan,
       n_live_tup,
       n_dead_tup
FROM pg_stat_user_tables
WHERE schemaname = 'm_monitoring'
ORDER BY relname;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT relname,
         seq_scan,
         idx_scan,
         n_live_tup,
         n_dead_tup
  FROM pg_stat_user_tables
  WHERE schemaname = 'm_monitoring'
  ORDER BY relname
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT relname,
             seq_scan,
             idx_scan,
             n_live_tup,
             n_dead_tup
      FROM pg_stat_user_tables
      WHERE schemaname = 'm_monitoring'
      ORDER BY relname
    `),
};

export default example;
