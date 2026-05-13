import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { orders } from '../schema.ts';

const example: ExampleDef = {
  id: 'window-row-number',
  title: 'ROW_NUMBER：每客户的订单按时间编号',
  support: 'partial',
  display: {
    sql: `SELECT id,
       customer_id,
       ordered_at,
       row_number() OVER (PARTITION BY customer_id ORDER BY ordered_at) AS rn
FROM orders
ORDER BY customer_id, rn;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { orders } from './schema';

await db.execute(sql\`
  SELECT id,
         customer_id,
         ordered_at,
         row_number() OVER (PARTITION BY customer_id ORDER BY ordered_at) AS rn
  FROM \${orders}
  ORDER BY customer_id, rn
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT id,
             customer_id,
             ordered_at,
             row_number() OVER (PARTITION BY customer_id ORDER BY ordered_at) AS rn
      FROM ${orders}
      ORDER BY customer_id, rn
    `),
};

export default example;
