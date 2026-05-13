import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'vacuum-verbose',
  title: 'VACUUM VERBOSE — 看每张表扫了什么',
  support: 'partial',
  timeoutMs: 30000,
  display: {
    sql: `-- 实际你会在 psql 里运行：
--   VACUUM (VERBOSE) bloat_demo;
-- 会输出类似：
--   INFO:  vacuuming "m_vacuum.bloat_demo"
--   INFO:  finished vacuuming "m_vacuum.bloat_demo": index scans: 1
--          pages: 0 removed, 334 remain, ...
--          tuples: 5000 removed, 10000 remain, 0 are dead but not yet removable
--
-- 本课程 Runner 在事务里，VACUUM 不能跑；这里展示等价的事后统计

SELECT relname,
       relpages,
       pg_size_pretty(pg_relation_size(c.oid)) AS table_size,
       reltuples::bigint AS reltuples_estimate
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'm_vacuum'
  AND c.relname = 'bloat_demo';`,
    drizzle: `import { sql } from 'drizzle-orm';

// 在 psql 里执行：VACUUM (VERBOSE) bloat_demo;
await db.execute(sql\`
  SELECT relname,
         relpages,
         pg_size_pretty(pg_relation_size(c.oid)) AS table_size,
         reltuples::bigint AS reltuples_estimate
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname = 'm_vacuum'
    AND c.relname = 'bloat_demo'
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT relname,
             relpages,
             pg_size_pretty(pg_relation_size(c.oid)) AS table_size,
             reltuples::bigint AS reltuples_estimate
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'm_vacuum'
        AND c.relname = 'bloat_demo'
    `),
};

export default example;
