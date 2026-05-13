import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';

const example: ExampleDef = {
  id: 'agg-hash',
  title: 'HashAggregate — GROUP BY 不需要排序输入',
  support: 'partial',
  timeoutMs: 30000,
  display: {
    sql: `-- GROUP BY customer_id，输入无序，planner 走 HashAggregate
EXPLAIN ANALYZE
SELECT customer_id, count(*) AS cnt, sum(total) AS revenue
FROM orders
GROUP BY customer_id;`,
    drizzle: `import { sql } from 'drizzle-orm';

await db.execute(sql\`
  EXPLAIN ANALYZE
  SELECT customer_id, count(*) AS cnt, sum(total) AS revenue
  FROM orders
  GROUP BY customer_id
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      EXPLAIN ANALYZE
      SELECT customer_id, count(*) AS cnt, sum(total) AS revenue
      FROM orders
      GROUP BY customer_id
    `),
};

export default example;
