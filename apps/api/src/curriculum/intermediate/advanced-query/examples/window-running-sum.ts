import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { orders, products } from '../schema.ts';

const example: ExampleDef = {
  id: 'window-running-sum',
  title: '累计销售：SUM OVER 按客户分区',
  support: 'partial',
  display: {
    sql: `SELECT o.customer_id,
       o.id   AS order_id,
       o.ordered_at,
       o.qty * p.price AS amount,
       sum(o.qty * p.price)
         OVER (PARTITION BY o.customer_id ORDER BY o.ordered_at) AS running_total
FROM orders   o
JOIN products p ON p.id = o.product_id
ORDER BY o.customer_id, o.ordered_at;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { orders, products } from './schema';

await db.execute(sql\`
  SELECT o.customer_id,
         o.id   AS order_id,
         o.ordered_at,
         o.qty * p.price AS amount,
         sum(o.qty * p.price)
           OVER (PARTITION BY o.customer_id ORDER BY o.ordered_at) AS running_total
  FROM \${orders}   o
  JOIN \${products} p ON p.id = o.product_id
  ORDER BY o.customer_id, o.ordered_at
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT o.customer_id,
             o.id   AS order_id,
             o.ordered_at,
             o.qty * p.price AS amount,
             sum(o.qty * p.price)
               OVER (PARTITION BY o.customer_id ORDER BY o.ordered_at) AS running_total
      FROM ${orders}   o
      JOIN ${products} p ON p.id = o.product_id
      ORDER BY o.customer_id, o.ordered_at
    `),
};

export default example;
