import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'detach-partition',
  title: 'DETACH 旧分区再 ATTACH 还原',
  support: 'partial',
  display: {
    sql: `-- 1. DETACH：sales_q4 变成独立的普通表
ALTER TABLE sales DETACH PARTITION sales_q4;

-- 2. 验证：sales_q4 已不在 pg_inherits 里
-- SELECT inhrelid::regclass FROM pg_inherits WHERE inhparent = 'sales'::regclass;

-- 3. 还原：ATTACH 回去，保持模块状态不变
ALTER TABLE sales ATTACH PARTITION sales_q4
  FOR VALUES FROM ('2025-10-01') TO ('2026-01-01');`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`ALTER TABLE sales DETACH PARTITION sales_q4\`);

const result = await db.execute(sql\`
  SELECT inhrelid::regclass AS partition
  FROM pg_inherits
  WHERE inhparent = 'sales'::regclass
  ORDER BY partition
\`);

await db.execute(sql\`
  ALTER TABLE sales ATTACH PARTITION sales_q4
    FOR VALUES FROM ('2025-10-01') TO ('2026-01-01')
\`);`,
  },
  execute: async (db) => {
    // 防御：万一上次中断时 sales_q4 还在 detached 状态
    const stillAttached = await db.execute(sql`
      SELECT 1
      FROM pg_inherits
      WHERE inhparent = 'sales'::regclass
        AND inhrelid  = 'sales_q4'::regclass
    `);
    if ((stillAttached as { rows?: unknown[] }).rows?.length) {
      await db.execute(sql`ALTER TABLE sales DETACH PARTITION sales_q4`);
    }

    const result = await db.execute(sql`
      SELECT inhrelid::regclass::text AS partition
      FROM pg_inherits
      WHERE inhparent = 'sales'::regclass
      ORDER BY partition
    `);

    await db.execute(sql`
      ALTER TABLE sales ATTACH PARTITION sales_q4
        FOR VALUES FROM ('2025-10-01') TO ('2026-01-01')
    `);

    return result;
  },
};

export default example;
