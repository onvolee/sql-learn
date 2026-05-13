import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'index-scan',
  title: 'Index Scan — 建索引后等值查询',
  support: 'partial',
  timeoutMs: 30000,
  display: {
    sql: `-- 先建索引（IF NOT EXISTS 让多次跑安全）
CREATE INDEX IF NOT EXISTS orders_customer_id_idx ON orders (customer_id);

-- 命中 1000 行里某个 customer 的少量订单，planner 该走 Index Scan
EXPLAIN ANALYZE
SELECT * FROM orders
WHERE customer_id = 42;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  CREATE INDEX IF NOT EXISTS orders_customer_id_idx ON orders (customer_id)
\`);

await db.execute(sql\`
  EXPLAIN ANALYZE
  SELECT * FROM orders
  WHERE customer_id = 42
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`CREATE INDEX IF NOT EXISTS orders_customer_id_idx ON orders (customer_id)`);
    return db.execute(sql`
      EXPLAIN ANALYZE
      SELECT * FROM orders
      WHERE customer_id = 42
    `);
  },
};

export default example;
