import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'function-on-column-blocks-index',
  title: '函数包裹列 → 普通索引失效',
  support: 'partial',
  timeoutMs: 30000,
  display: {
    sql: `-- 1) 给 customers.name 建普通索引
CREATE INDEX IF NOT EXISTS customers_name_idx ON customers (name);

-- 2) 函数包裹列，普通索引无效 → Seq Scan
EXPLAIN ANALYZE
SELECT * FROM customers
WHERE lower(name) = 'cust_42';

-- 3) 建表达式索引匹配同一表达式 → 走 Index Scan
CREATE INDEX IF NOT EXISTS customers_lower_name_idx ON customers (lower(name));

EXPLAIN ANALYZE
SELECT * FROM customers
WHERE lower(name) = 'cust_42';`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  CREATE INDEX IF NOT EXISTS customers_name_idx ON customers (name)
\`);

// 函数包裹列，普通索引失效
await db.execute(sql\`
  EXPLAIN ANALYZE
  SELECT * FROM customers
  WHERE lower(name) = 'cust_42'
\`);

await db.execute(sql\`
  CREATE INDEX IF NOT EXISTS customers_lower_name_idx ON customers (lower(name))
\`);

// 表达式索引匹配，走 Index Scan
await db.execute(sql\`
  EXPLAIN ANALYZE
  SELECT * FROM customers
  WHERE lower(name) = 'cust_42'
\`);`,
  },
  execute: async (db) => {
    await db.execute(sql`CREATE INDEX IF NOT EXISTS customers_name_idx ON customers (name)`);
    await db.execute(sql`
      EXPLAIN ANALYZE
      SELECT * FROM customers
      WHERE lower(name) = 'cust_42'
    `);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS customers_lower_name_idx ON customers (lower(name))`);
    return db.execute(sql`
      EXPLAIN ANALYZE
      SELECT * FROM customers
      WHERE lower(name) = 'cust_42'
    `);
  },
};

export default example;
