import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'implicit-cast-blocks-index',
  title: '隐式类型转换 — 不一致类型',
  support: 'partial',
  timeoutMs: 30000,
  display: {
    sql: `-- 假设 customer_id 上已有索引
CREATE INDEX IF NOT EXISTS orders_customer_id_idx ON orders (customer_id);

-- 1) 类型一致，integer = integer → Index Scan
EXPLAIN ANALYZE
SELECT count(*) FROM orders
WHERE customer_id = 42;

-- 2) 字面量 text 与 integer 列比较，PG 隐式把字面量转 integer，索引仍可用
--    但若两侧是 text vs bigint 这类不同类，cast 会落在列上，索引失效
EXPLAIN ANALYZE
SELECT count(*) FROM orders
WHERE customer_id::text = '42';`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  CREATE INDEX IF NOT EXISTS orders_customer_id_idx ON orders (customer_id)
\`);

// 类型一致，走 Index Scan
await db.execute(sql\`
  EXPLAIN ANALYZE
  SELECT count(*) FROM orders
  WHERE customer_id = 42
\`);

// cast 落在列上，索引失效
await db.execute(sql\`
  EXPLAIN ANALYZE
  SELECT count(*) FROM orders
  WHERE customer_id::text = '42'
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`CREATE INDEX IF NOT EXISTS orders_customer_id_idx ON orders (customer_id)`);
    await db.execute(sql`
      EXPLAIN ANALYZE
      SELECT count(*) FROM orders
      WHERE customer_id = 42
    `);
    return db.execute(sql`
      EXPLAIN ANALYZE
      SELECT count(*) FROM orders
      WHERE customer_id::text = '42'
    `);
  },
};

export default example;
