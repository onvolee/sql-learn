import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'sort-then-limit',
  title: 'Sort + Limit — total 无索引，必须先排序',
  support: 'partial',
  timeoutMs: 30000,
  display: {
    sql: `-- 先确保 total 上没有 DESC 索引（让本例稳定显示 Sort 节点）
DROP INDEX IF EXISTS orders_total_desc_idx;

EXPLAIN ANALYZE
SELECT id, total
FROM orders
ORDER BY total DESC
LIMIT 10;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`DROP INDEX IF EXISTS orders_total_desc_idx\`);

await db.execute(sql\`
  EXPLAIN ANALYZE
  SELECT id, total
  FROM orders
  ORDER BY total DESC
  LIMIT 10
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`DROP INDEX IF EXISTS orders_total_desc_idx`);
    return db.execute(sql`
      EXPLAIN ANALYZE
      SELECT id, total
      FROM orders
      ORDER BY total DESC
      LIMIT 10
    `);
  },
};

export default example;
