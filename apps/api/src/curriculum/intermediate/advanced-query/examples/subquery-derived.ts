import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { customers, orders, products } from '../schema.ts';

const example: ExampleDef = {
  id: 'subquery-derived',
  title: '派生表：先按 region 汇总，再过滤',
  support: 'partial',
  display: {
    sql: `SELECT region, total
FROM (
  SELECT c.region,
         sum(o.qty * p.price) AS total
  FROM customers c
  JOIN orders   o ON o.customer_id = c.id
  JOIN products p ON p.id = o.product_id
  GROUP BY c.region
) t
WHERE total > 1000
ORDER BY total DESC;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { customers, orders, products } from './schema';

await db.execute(sql\`
  SELECT region, total
  FROM (
    SELECT c.region,
           sum(o.qty * p.price) AS total
    FROM \${customers} c
    JOIN \${orders}    o ON o.customer_id = c.id
    JOIN \${products}  p ON p.id = o.product_id
    GROUP BY c.region
  ) t
  WHERE total > 1000
  ORDER BY total DESC
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT region, total
      FROM (
        SELECT c.region,
               sum(o.qty * p.price) AS total
        FROM ${customers} c
        JOIN ${orders}    o ON o.customer_id = c.id
        JOIN ${products}  p ON p.id = o.product_id
        GROUP BY c.region
      ) t
      WHERE total > 1000
      ORDER BY total DESC
    `),
};

export default example;
