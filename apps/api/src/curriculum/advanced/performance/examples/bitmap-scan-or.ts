import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'bitmap-scan-or',
  title: 'BitmapOr — 多索引 OR 合并',
  support: 'partial',
  timeoutMs: 30000,
  display: {
    sql: `-- 给 customer_id 和 total 各建一个索引
CREATE INDEX IF NOT EXISTS orders_customer_id_idx ON orders (customer_id);
CREATE INDEX IF NOT EXISTS orders_total_idx ON orders (total);

-- OR 跨两个有索引的列，planner 大概率走 BitmapOr
EXPLAIN ANALYZE
SELECT * FROM orders
WHERE customer_id = 42 OR total > 990;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  CREATE INDEX IF NOT EXISTS orders_customer_id_idx ON orders (customer_id)
\`);
await db.execute(sql\`
  CREATE INDEX IF NOT EXISTS orders_total_idx ON orders (total)
\`);

await db.execute(sql\`
  EXPLAIN ANALYZE
  SELECT * FROM orders
  WHERE customer_id = 42 OR total > 990
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`CREATE INDEX IF NOT EXISTS orders_customer_id_idx ON orders (customer_id)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS orders_total_idx ON orders (total)`);
    return db.execute(sql`
      EXPLAIN ANALYZE
      SELECT * FROM orders
      WHERE customer_id = 42 OR total > 990
    `);
  },
};

export default example;
