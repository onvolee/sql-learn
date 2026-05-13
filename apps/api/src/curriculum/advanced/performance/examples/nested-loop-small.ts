import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'nested-loop-small',
  title: 'Nested Loop — 一边只取 1 行 + 索引',
  support: 'partial',
  timeoutMs: 30000,
  display: {
    sql: `-- 内层 orders 有 customer_id 索引；外层只取 1 个 customer
-- planner 倾向 Nested Loop：外层 1 行，内层走索引
CREATE INDEX IF NOT EXISTS orders_customer_id_idx ON orders (customer_id);

EXPLAIN ANALYZE
SELECT c.name, o.id, o.total
FROM customers c
JOIN orders o ON o.customer_id = c.id
WHERE c.id = 42;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  CREATE INDEX IF NOT EXISTS orders_customer_id_idx ON orders (customer_id)
\`);

await db.execute(sql\`
  EXPLAIN ANALYZE
  SELECT c.name, o.id, o.total
  FROM customers c
  JOIN orders o ON o.customer_id = c.id
  WHERE c.id = 42
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`CREATE INDEX IF NOT EXISTS orders_customer_id_idx ON orders (customer_id)`);
    return db.execute(sql`
      EXPLAIN ANALYZE
      SELECT c.name, o.id, o.total
      FROM customers c
      JOIN orders o ON o.customer_id = c.id
      WHERE c.id = 42
    `);
  },
};

export default example;
