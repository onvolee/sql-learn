import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'relation-size-before-after-full',
  title: 'VACUUM FULL 真正缩小磁盘（语义展示）',
  support: 'partial',
  timeoutMs: 30000,
  display: {
    sql: `-- 完整流程（psql 里实际跑）：
--   SELECT pg_size_pretty(pg_relation_size('bloat_demo'));  -- 初始大小
--   DELETE FROM bloat_demo WHERE id <= 5000;
--   SELECT pg_size_pretty(pg_relation_size('bloat_demo'));  -- 不变，dead tuple 占着
--   VACUUM bloat_demo;
--   SELECT pg_size_pretty(pg_relation_size('bloat_demo'));  -- 仍不变，只是空间可重用
--   VACUUM FULL bloat_demo;
--   SELECT pg_size_pretty(pg_relation_size('bloat_demo'));  -- 文件被重写，显著缩小
--
-- 本课程 Runner 不能跑 VACUUM，这里展示如何观察物理大小

SELECT pg_size_pretty(pg_relation_size('bloat_demo')) AS heap_size,
       pg_size_pretty(pg_total_relation_size('bloat_demo')) AS total_size_with_indexes,
       pg_relation_size('bloat_demo') AS heap_bytes;`,
    drizzle: `import { sql } from 'drizzle-orm';

// 在 psql 里跑完 DELETE + VACUUM FULL 后观察大小变化
await db.execute(sql\`
  SELECT pg_size_pretty(pg_relation_size('bloat_demo'))             AS heap_size,
         pg_size_pretty(pg_total_relation_size('bloat_demo'))        AS total_size_with_indexes,
         pg_relation_size('bloat_demo')                              AS heap_bytes
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT pg_size_pretty(pg_relation_size('bloat_demo'))             AS heap_size,
             pg_size_pretty(pg_total_relation_size('bloat_demo'))        AS total_size_with_indexes,
             pg_relation_size('bloat_demo')                              AS heap_bytes
    `),
};

export default example;
