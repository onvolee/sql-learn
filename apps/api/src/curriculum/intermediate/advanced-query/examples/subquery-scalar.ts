import { sql } from 'drizzle-orm';
import type { ExampleDef } from '../../../types.ts';
import { customers, orders } from '../schema.ts';

const example: ExampleDef = {
  id: 'subquery-scalar',
  title: '标量子查询：每个客户的下单数',
  support: 'partial',
  display: {
    sql: `SELECT c.id,
       c.name,
       (SELECT count(*) FROM orders o WHERE o.customer_id = c.id) AS order_count
FROM customers c
ORDER BY c.id;`,
    drizzle: `import { sql } from 'drizzle-orm';
import { customers, orders } from './schema';

await db.execute(sql\`
  SELECT c.id,
         c.name,
         (SELECT count(*) FROM \${orders} o WHERE o.customer_id = c.id) AS order_count
  FROM \${customers} c
  ORDER BY c.id
\`);`,
  },
  execute: (db) =>
    db.execute(sql`
      SELECT c.id,
             c.name,
             (SELECT count(*) FROM ${orders} o WHERE o.customer_id = c.id) AS order_count
      FROM ${customers} c
      ORDER BY c.id
    `),
};

export default example;
