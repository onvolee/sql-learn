import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'last-autovacuum-time',
  title: '本模块各表最近一次 vacuum 时间',
  support: 'partial',
  display: {
    sql: `SELECT relname,
       last_vacuum,
       last_autovacuum,
       last_analyze,
       last_autoanalyze,
       vacuum_count,
       autovacuum_count
FROM pg_stat_user_tables
WHERE schemaname = 'm_vacuum'
ORDER BY relname;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  SELECT relname,
         last_vacuum,
         last_autovacuum,
         last_analyze,
         last_autoanalyze,
         vacuum_count,
         autovacuum_count
  FROM pg_stat_user_tables
  WHERE schemaname = 'm_vacuum'
  ORDER BY relname
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT relname,
             last_vacuum,
             last_autovacuum,
             last_analyze,
             last_autoanalyze,
             vacuum_count,
             autovacuum_count
      FROM pg_stat_user_tables
      WHERE schemaname = 'm_vacuum'
      ORDER BY relname
    `),
};

export default example;
