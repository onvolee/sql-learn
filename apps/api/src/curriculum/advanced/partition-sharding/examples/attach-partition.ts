import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'attach-partition',
  title: 'ATTACH 新季度分区（含 cleanup）',
  support: 'partial',
  display: {
    sql: `-- 1. 建子表（独立，结构对齐主表）
CREATE TABLE IF NOT EXISTS sales_q1_2026 (LIKE sales INCLUDING ALL);

-- 2. ATTACH 进主表，声明区间
ALTER TABLE sales ATTACH PARTITION sales_q1_2026
  FOR VALUES FROM ('2026-01-01') TO ('2026-04-01');

-- 3. 验证：新分区已挂载
-- SELECT inhrelid::regclass FROM pg_inherits WHERE inhparent = 'sales'::regclass;

-- 4. cleanup：DETACH 再 DROP，保证重复运行不报错
ALTER TABLE sales DETACH PARTITION sales_q1_2026;
DROP TABLE sales_q1_2026;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`CREATE TABLE IF NOT EXISTS sales_q1_2026 (LIKE sales INCLUDING ALL)\`);
await db.execute(sql\`
  ALTER TABLE sales ATTACH PARTITION sales_q1_2026
    FOR VALUES FROM ('2026-01-01') TO ('2026-04-01')
\`);

const result = await db.execute(sql\`
  SELECT inhrelid::regclass AS partition
  FROM pg_inherits
  WHERE inhparent = 'sales'::regclass
  ORDER BY partition
\`);

await db.execute(sql\`ALTER TABLE sales DETACH PARTITION sales_q1_2026\`);
await db.execute(sql\`DROP TABLE sales_q1_2026\`);`,
  },
  execute: async (db) => {
    // 防御性 cleanup：如果上次运行中断留下了悬挂表，先清掉
    await db.execute(sql`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM pg_inherits
          WHERE inhparent = 'sales'::regclass
            AND inhrelid  = 'sales_q1_2026'::regclass
        ) THEN
          EXECUTE 'ALTER TABLE sales DETACH PARTITION sales_q1_2026';
        END IF;
      EXCEPTION WHEN undefined_table THEN
        NULL;
      END$$;
    `);
    await db.execute(sql`DROP TABLE IF EXISTS sales_q1_2026 CASCADE`);

    await db.execute(sql`CREATE TABLE IF NOT EXISTS sales_q1_2026 (LIKE sales INCLUDING ALL)`);
    await db.execute(sql`
      ALTER TABLE sales ATTACH PARTITION sales_q1_2026
        FOR VALUES FROM ('2026-01-01') TO ('2026-04-01')
    `);

    const result = await db.execute(sql`
      SELECT inhrelid::regclass::text AS partition
      FROM pg_inherits
      WHERE inhparent = 'sales'::regclass
      ORDER BY partition
    `);

    // cleanup：保持模块状态不变
    await db.execute(sql`ALTER TABLE sales DETACH PARTITION sales_q1_2026`);
    await db.execute(sql`DROP TABLE IF EXISTS sales_q1_2026 CASCADE`);

    return result;
  },
};

export default example;
