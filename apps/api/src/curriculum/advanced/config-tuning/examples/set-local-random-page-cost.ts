import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'set-local-random-page-cost',
  title: 'SET LOCAL random_page_cost 影响 planner 估算',
  support: 'partial',
  display: {
    sql: `-- 先建一个 probe.val 上的索引（重复运行用 IF NOT EXISTS）
CREATE INDEX IF NOT EXISTS probe_val_idx ON probe(val);

-- 默认 random_page_cost = 4，planner 在小表上往往选 Seq Scan
EXPLAIN SELECT id FROM probe WHERE val = 'alpha';

-- 把随机读代价压到 1.1（SSD 经验值），再看一次
SET LOCAL random_page_cost = 1.1;
EXPLAIN SELECT id FROM probe WHERE val = 'alpha';
-- 注意：probe 只有 5 行，多数情况下两次都还是 Seq Scan，
-- 但 EXPLAIN 行尾的 cost=... 数值会变化。`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`CREATE INDEX IF NOT EXISTS probe_val_idx ON probe(val)\`);

const defaultPlan = await db.execute(
  sql\`EXPLAIN SELECT id FROM probe WHERE val = 'alpha'\`,
);

await db.execute(sql\`SET LOCAL random_page_cost = 1.1\`);

const tunedPlan = await db.execute(
  sql\`EXPLAIN SELECT id FROM probe WHERE val = 'alpha'\`,
);

return { defaultPlan, tunedPlan };`,
  },
  execute: async (db) => {
    await db.execute(
      sql`CREATE INDEX IF NOT EXISTS probe_val_idx ON probe(val)`,
    );
    const defaultPlan = await db.execute(
      sql`EXPLAIN SELECT id FROM probe WHERE val = 'alpha'`,
    );
    await db.execute(sql`SET LOCAL random_page_cost = 1.1`);
    const tunedPlan = await db.execute(
      sql`EXPLAIN SELECT id FROM probe WHERE val = 'alpha'`,
    );
    return { defaultPlan, tunedPlan };
  },
};

export default example;
