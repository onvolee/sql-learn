import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { orders } from '../schema.ts';

const example: ExampleDef = {
  id: 'window-lag-diff',
  title: 'LAG：每客户两次相邻下单的时间差',
  support: 'partial',
  display: {
    sql: `SELECT customer_id,
       id,
       ordered_at,
       lag(ordered_at) OVER (PARTITION BY customer_id ORDER BY ordered_at) AS prev_at,
       ordered_at - lag(ordered_at) OVER (PARTITION BY customer_id ORDER BY ordered_at) AS gap
FROM orders
ORDER BY customer_id, ordered_at;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { orders } from './schema';

await db.execute(sql\`
  SELECT customer_id,
         id,
         ordered_at,
         lag(ordered_at) OVER (PARTITION BY customer_id ORDER BY ordered_at) AS prev_at,
         ordered_at - lag(ordered_at) OVER (PARTITION BY customer_id ORDER BY ordered_at) AS gap
  FROM \${orders}
  ORDER BY customer_id, ordered_at
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT customer_id,
             id,
             ordered_at,
             lag(ordered_at) OVER (PARTITION BY customer_id ORDER BY ordered_at) AS prev_at,
             ordered_at - lag(ordered_at) OVER (PARTITION BY customer_id ORDER BY ordered_at) AS gap
      FROM ${orders}
      ORDER BY customer_id, ordered_at
    `),
};

export default example;
