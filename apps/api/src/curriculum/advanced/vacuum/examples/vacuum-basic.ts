import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'vacuum-basic',
  title: 'VACUUM bloat_demo（语义展示，实际查 stats）',
  support: 'partial',
  timeoutMs: 30000,
  display: {
    sql: `-- 实际你会在 psql 里运行：
--   VACUUM bloat_demo;
-- 本课程的 Runner 在事务内执行，VACUUM 不能在事务里跑，
-- 这里改为读 pg_stat_user_tables 看 vacuum 留下的痕迹

SELECT relname,
       n_live_tup,
       n_dead_tup,
       last_vacuum,
       last_autovacuum,
       vacuum_count,
       autovacuum_count
FROM pg_stat_user_tables
WHERE schemaname = 'm_vacuum'
  AND relname = 'bloat_demo';`,
    drizzle: `import { sql } from 'drizzle-orm';

// 在 psql 里执行：VACUUM bloat_demo;
// 这里读 stats 看效果
await db.execute(sql\`
  SELECT relname,
         n_live_tup,
         n_dead_tup,
         last_vacuum,
         last_autovacuum,
         vacuum_count,
         autovacuum_count
  FROM pg_stat_user_tables
  WHERE schemaname = 'm_vacuum'
    AND relname = 'bloat_demo'
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT relname,
             n_live_tup,
             n_dead_tup,
             last_vacuum,
             last_autovacuum,
             vacuum_count,
             autovacuum_count
      FROM pg_stat_user_tables
      WHERE schemaname = 'm_vacuum'
        AND relname = 'bloat_demo'
    `),
};

export default example;
