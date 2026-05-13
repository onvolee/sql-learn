import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'index-skips-sort',
  title: 'Index 跳过 Sort — (total DESC) 索引',
  support: 'partial',
  timeoutMs: 30000,
  display: {
    sql: `-- 建立匹配 ORDER BY 的索引，planner 顺着读、Sort 节点消失
CREATE INDEX IF NOT EXISTS orders_total_desc_idx ON orders (total DESC);

EXPLAIN ANALYZE
SELECT id, total
FROM orders
ORDER BY total DESC
LIMIT 10;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  CREATE INDEX IF NOT EXISTS orders_total_desc_idx ON orders (total DESC)
\`);

await db.execute(sql\`
  EXPLAIN ANALYZE
  SELECT id, total
  FROM orders
  ORDER BY total DESC
  LIMIT 10
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`CREATE INDEX IF NOT EXISTS orders_total_desc_idx ON orders (total DESC)`);
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
