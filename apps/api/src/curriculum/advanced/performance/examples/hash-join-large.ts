import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'hash-join-large',
  title: 'Hash Join — 大表等值 JOIN',
  support: 'partial',
  timeoutMs: 30000,
  display: {
    sql: `-- 不限定 customer，10 万 orders × 1000 customers
-- planner 倾向 Hash Join：小表 customers 建哈希表，扫大表 orders probe
EXPLAIN ANALYZE
SELECT c.region, count(*) AS cnt
FROM customers c
JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'paid'
GROUP BY c.region;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  EXPLAIN ANALYZE
  SELECT c.region, count(*) AS cnt
  FROM customers c
  JOIN orders o ON o.customer_id = c.id
  WHERE o.status = 'paid'
  GROUP BY c.region
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      EXPLAIN ANALYZE
      SELECT c.region, count(*) AS cnt
      FROM customers c
      JOIN orders o ON o.customer_id = c.id
      WHERE o.status = 'paid'
      GROUP BY c.region
    `),
};

export default example;
