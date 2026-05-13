import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { customers, orders } from '../schema.ts';

const example: ExampleDef = {
  id: 'join-full',
  title: 'FULL OUTER JOIN：两边都保留',
  support: 'partial',
  display: {
    sql: `SELECT c.id   AS customer_id,
       c.name AS customer,
       o.id   AS order_id
FROM customers c
FULL OUTER JOIN orders o ON o.customer_id = c.id
ORDER BY c.id NULLS LAST, o.id NULLS LAST;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { customers, orders } from './schema';

await db.execute(sql\`
  SELECT c.id   AS customer_id,
         c.name AS customer,
         o.id   AS order_id
  FROM \${customers} c
  FULL OUTER JOIN \${orders} o ON o.customer_id = c.id
  ORDER BY c.id NULLS LAST, o.id NULLS LAST
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT c.id   AS customer_id,
             c.name AS customer,
             o.id   AS order_id
      FROM ${customers} c
      FULL OUTER JOIN ${orders} o ON o.customer_id = c.id
      ORDER BY c.id NULLS LAST, o.id NULLS LAST
    `),
};

export default example;
