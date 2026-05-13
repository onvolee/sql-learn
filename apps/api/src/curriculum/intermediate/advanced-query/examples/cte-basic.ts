import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { orders } from '../schema.ts';

const example: ExampleDef = {
  id: 'cte-basic',
  title: '基础 CTE：先筛大订单再计数',
  support: 'partial',
  display: {
    sql: `WITH big_orders AS (
  SELECT id, customer_id, qty
  FROM orders
  WHERE qty > 5
)
SELECT count(*) AS n,
       max(qty) AS max_qty
FROM big_orders;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { orders } from './schema';

await db.execute(sql\`
  WITH big_orders AS (
    SELECT id, customer_id, qty
    FROM \${orders}
    WHERE qty > 5
  )
  SELECT count(*) AS n,
         max(qty) AS max_qty
  FROM big_orders
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      WITH big_orders AS (
        SELECT id, customer_id, qty
        FROM ${orders}
        WHERE qty > 5
      )
      SELECT count(*) AS n,
             max(qty) AS max_qty
      FROM big_orders
    `),
};

export default example;
