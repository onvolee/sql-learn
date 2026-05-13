import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'mv-refresh-concurrently',
  title: 'CONCURRENTLY 要求 UNIQUE 索引',
  support: 'partial',
  display: {
    sql: `-- 1) 无 UNIQUE 索引时，CONCURRENTLY 报错
DO $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_region_total;
EXCEPTION WHEN feature_not_supported THEN
  RAISE NOTICE 'concurrent refresh requires a unique index';
END $$;

-- 2) 建 UNIQUE 索引，再 CONCURRENTLY 刷新
CREATE UNIQUE INDEX IF NOT EXISTS mv_region_total_region_uidx
  ON mv_region_total (region);
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_region_total;

SELECT region, total_amount FROM mv_region_total ORDER BY region;

-- 3) 清理 example 自建的索引
DROP INDEX IF EXISTS mv_region_total_region_uidx;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  DO $$
  BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_region_total;
  EXCEPTION WHEN feature_not_supported THEN
    RAISE NOTICE 'concurrent refresh requires a unique index';
  END $$
\`);

await db.execute(sql\`
  CREATE UNIQUE INDEX IF NOT EXISTS mv_region_total_region_uidx
    ON mv_region_total (region)
\`);
await db.execute(sql\`REFRESH MATERIALIZED VIEW CONCURRENTLY mv_region_total\`);

const rows = await db.execute(sql\`
  SELECT region, total_amount FROM mv_region_total ORDER BY region
\`);

await db.execute(sql\`DROP INDEX IF EXISTS mv_region_total_region_uidx\`);
return rows;`,
  },
  execute: async (db) => {
    // 1) 在 PL/pgSQL DO 块里捕获 feature_not_supported，把"失败"演示在 NOTICE 里。
    //    若 example 上一次已建了 unique 索引但没清理，则这里不会报错，DO 块照样过。
    await db.execute(sql`
      DO $$
      BEGIN
        REFRESH MATERIALIZED VIEW CONCURRENTLY mv_region_total;
      EXCEPTION WHEN feature_not_supported THEN
        RAISE NOTICE 'concurrent refresh requires a unique index';
      END $$
    `);

    // 2) 建 UNIQUE 索引后再 CONCURRENTLY 刷新
    await db.execute(sql`
      CREATE UNIQUE INDEX IF NOT EXISTS mv_region_total_region_uidx
        ON mv_region_total (region)
    `);
    await db.execute(sql`REFRESH MATERIALIZED VIEW CONCURRENTLY mv_region_total`);

    const rows = await db.execute(sql`
      SELECT region, total_amount FROM mv_region_total ORDER BY region
    `);

    // 3) cleanup：删掉 example 自建的索引，保证下次运行仍能演示"无索引 → 失败"
    await db.execute(sql`DROP INDEX IF EXISTS mv_region_total_region_uidx`);
    return rows;
  },
};

export default example;
