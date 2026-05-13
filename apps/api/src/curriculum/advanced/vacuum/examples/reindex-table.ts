import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'reindex-table',
  title: 'REINDEX TABLE bloat_demo（语义展示）',
  support: 'partial',
  timeoutMs: 30000,
  display: {
    sql: `-- 实际你会在 psql 里运行：
--   REINDEX TABLE bloat_demo;                  -- 取 ACCESS EXCLUSIVE 锁
--   REINDEX TABLE CONCURRENTLY bloat_demo;     -- 在线重建，仅短暂强锁
-- 本课程 Runner 在事务里，REINDEX 不能跑；这里展示该表上索引的元数据

SELECT i.relname             AS index_name,
       am.amname             AS index_type,
       pg_size_pretty(pg_relation_size(i.oid)) AS index_size
FROM pg_index x
JOIN pg_class t  ON t.oid  = x.indrelid
JOIN pg_class i  ON i.oid  = x.indexrelid
JOIN pg_am    am ON am.oid = i.relam
JOIN pg_namespace n ON n.oid = t.relnamespace
WHERE n.nspname = 'm_vacuum'
  AND t.relname = 'bloat_demo'
ORDER BY i.relname;`,
    drizzle: `import { sql } from 'drizzle-orm';

// 在 psql 里执行：REINDEX TABLE bloat_demo;
await db.execute(sql\`
  SELECT i.relname             AS index_name,
         am.amname             AS index_type,
         pg_size_pretty(pg_relation_size(i.oid)) AS index_size
  FROM pg_index x
  JOIN pg_class t  ON t.oid  = x.indrelid
  JOIN pg_class i  ON i.oid  = x.indexrelid
  JOIN pg_am    am ON am.oid = i.relam
  JOIN pg_namespace n ON n.oid = t.relnamespace
  WHERE n.nspname = 'm_vacuum'
    AND t.relname = 'bloat_demo'
  ORDER BY i.relname
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT i.relname             AS index_name,
             am.amname             AS index_type,
             pg_size_pretty(pg_relation_size(i.oid)) AS index_size
      FROM pg_index x
      JOIN pg_class t  ON t.oid  = x.indrelid
      JOIN pg_class i  ON i.oid  = x.indexrelid
      JOIN pg_am    am ON am.oid = i.relam
      JOIN pg_namespace n ON n.oid = t.relnamespace
      WHERE n.nspname = 'm_vacuum'
        AND t.relname = 'bloat_demo'
      ORDER BY i.relname
    `),
};

export default example;
